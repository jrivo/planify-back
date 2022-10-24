import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { RegisterDto } from './auth.dto';
import { createSftpUser } from 'src/utils/sftpgo';
import {
  generateLicenseKey,
  sendEmail,
} from 'src/utils/general';
import * as crypto from 'crypto';
import { DEFAULT_SALT } from 'src/config';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //generate salt by user and use it to compare password

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const hashedInputPassword = crypto
      .createHmac('sha256', user.salt)
      .update(pass)
      .digest('hex');
    if (hashedInputPassword === user.password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    //Here we add whatever we want to the token (in req.user)
    const payload = { sub: user.id, organizationId: user.organizationId };
    return {
      email: user.email,
      role: user.role,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(body: RegisterDto) {
    const user = await this.usersService.findByEmail(body.email);
    if (user) {
      throw new UnauthorizedException('User already exists');
    }
    const newUser = await this.registerCreateEntities(body);
    const payload = { sub: newUser.id, organizationId: newUser.organizationId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerCreateEntities(data: RegisterDto) {
    try {
      const licenseKey = generateLicenseKey();
      const salt = crypto.randomBytes(16).toString('base64');
      const hashedPassword = crypto
        .createHmac('sha256', salt)
        .update(data.password)
        .digest('hex');
      const newUser = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          salt: salt,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber && data.phoneNumber,
          organization: {
            create: {
              name: data.organizationName,
              logo: data.organizationLogo && data.organizationLogo,
              address: {
                create: {
                  street: data.organizationAddress.street,
                  line2:
                    data.organizationAddress.line2 &&
                    data.organizationAddress.line2,
                  companyName: data.organizationName,
                  postalCode: data.organizationAddress.postalCode,
                  city: data.organizationAddress.city,
                  state:
                    data.organizationAddress.state &&
                    data.organizationAddress.state,
                  country: data.organizationAddress.country,
                },
              },
              stripeId: data.organizationStripeId && data.organizationStripeId,
              licenses: {
                create: {
                  keyHash: crypto
                    .createHmac('sha256', DEFAULT_SALT)
                    .update(licenseKey)
                    .digest('hex'),
                  keyLast4: licenseKey.substring(licenseKey.length - 4),
                  ftpAccounts: {
                    create: {
                      username: 'test',
                      host: 'localhost',
                      port: 22,
                      protocol: 'SFTP',
                    },
                  },
                },
              },
            },
          },
          role: 'ORGADMIN',
        },
        include: {
          organization: {
            include: {
              licenses: {
                include: {
                  ftpAccounts: true,
                },
              },
            },
          },
        },
      });
      const sftpgoUser = await createSftpUser(
        newUser.organization.name,
        newUser.organization.licenses[0].id,
      );
      await prisma.ftpAccount.update({
        where: {
          id: newUser.organization.licenses[0].ftpAccounts[0].id,
        },
        data: {
          username: sftpgoUser.username,
        },
      });
      sendEmail(
        'Datexis MFT Credentials for : ' + newUser.organization.name,
        'Username: ' +
          sftpgoUser.username +
          '\n' +
          ' Password: ' +
          sftpgoUser.password +
          '\n' +
          'License Key: ' +
          licenseKey,
      );
      return newUser;
    } catch (e) {
      throw e;
    }
  }
}
