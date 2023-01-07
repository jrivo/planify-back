import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MediaType, PrismaClient, Role } from "@prisma/client";
import { ForgotPasswordDto, RegisterDto } from "./auth.dto";
import {
  BCRYPT_SALT_ROUNDS,
  CDN_STORAGE_PATH,
  CDN_STORAGE_ZONE,
} from "../const";
import * as bcrypt from "bcrypt";
import { generateToken, sanitizeFileName, sendResetPasswordEmail, sendVerificationEmail } from "src/utils";
import { UsersService } from "src/user/users.service";
import { jwtConstants } from "./constants";

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  //generate salt by user and use it to compare password

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    if (await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    if (user.status != "VERIFIED") {
      throw new UnauthorizedException("Please verify your account to login");
    }
    //Here we add whatever we want to the token (in req.user)
    const payload = { sub: user.id, email: user.email };
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
      }),
    };
  }

  async getUser(id: string) {
    const user = await this.usersService.findById(id);
    return exclude(user, "password");
  }

  async register(req: any, body: RegisterDto) {
    const user = await this.usersService.findByEmail(body.email);
    if (user) {
      throw new UnauthorizedException("User already exists");
    }
    const isAddress = body.street && body.streetNumber && body.city;
    let address = isAddress
      ? await prisma.address.create({
          data: {
            street: body.street,
            streetNumber: body.streetNumber,
            city: body.city,
            postalCode: body.postalCode,
            country: body.country,
            region: body.region && body.region,
          },
        })
      : null;
      const verificationToken = generateToken();
    let newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: bcrypt.hashSync(body.password, BCRYPT_SALT_ROUNDS),
        firstName: body.firstName,
        lastName: body.lastName,
        verificationToken: verificationToken,
        ...(address ? { address: { connect: { id: address.id } } } : ""),
        ...(body.phoneNumber ? { phone: body.phoneNumber } : ""),
        ...(body.role ? { role: Role[body.role] } : ""),
      },
      include: {
        profilePicture: true,
        address: true,
      },
    });
    if (req.files && req.files.length > 0) {
      try {
        req.files.forEach(async (file) => {
          let type = MediaType.IMAGE;
          await prisma.media.create({
            data: {
              name: sanitizeFileName(file.originalname),
              url:
                "https://" +
                CDN_STORAGE_ZONE +
                ".b-cdn.net/" +
                CDN_STORAGE_PATH +
                "/" +
                file.uploadName,
              type: type,
              user: { connect: { id: Number(newUser.id) } },
            },
          });
        });
      } catch (err) {
        throw err;
      }
    }
    sendVerificationEmail(newUser.email, verificationToken);
    // const payload = { sub: newUser.id, email: newUser.email };
    // return {
    //   id: newUser.id,
    //   email: newUser.email,
    //   access_token: this.jwtService.sign(payload, {
    //     secret: jwtConstants.secret,
    //   }),
    // };
    return "User created adn verification email sent"
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const user = await prisma.user.findUnique({
      where:{
        email:body.email
      }
    })
    if(!user){
      return false
    }
    const newPassword = generateToken(10);
    await prisma.user.update({
      where: {
        id: Number(user.id),
      },
      data: {
        password: bcrypt.hashSync(newPassword, BCRYPT_SALT_ROUNDS),
      },
    });
    sendResetPasswordEmail(user.email, newPassword);
    return true;
  }
}

function exclude<User, Key extends keyof User>(
  user: User,
  ...keys: Key[]
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
