import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MediaType, PrismaClient, Role } from "@prisma/client";
import { RegisterDto } from "./auth.dto";
import {
  BCRYPT_SALT_ROUNDS,
  CDN_STORAGE_PATH,
  CDN_STORAGE_ZONE,
} from "../const";
import * as bcrypt from "bcrypt";
import { sanitizeFileName } from "src/utils";
import { UsersService } from "src/user/users.service";

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
    //Here we add whatever we want to the token (in req.user)
    const payload = { sub: user.id, email: user.email };
    return {
      id: user.id,
      email: user.email,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(req: any, body: RegisterDto) {
    const user = await this.usersService.findByEmail(body.email);
    if (user) {
      throw new UnauthorizedException("User already exists");
    }
    let address = await prisma.address.create({
      data: {
        street: body.street,
        streetNumber: body.streetNumber,
        city: body.city,
        postalCode: body.postalCode,
        country: body.country,
        region: body.region && body.region,
      },
    });
    let newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: bcrypt.hashSync(body.password, BCRYPT_SALT_ROUNDS),
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phoneNumber && body.phoneNumber,
        address: { connect: { id: address.id } },
        role: Role[body.role],
      },
      include: {
        profilePicture: true,
        address: true,
      },
    });
    if (req.files) {
      try {
        req.files.forEach(async (file) => {
          let type = MediaType.PROFILE_PICTURE;
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
    const payload = { sub: newUser.id, email: newUser.email };
    return {
      id: newUser.id,
      email: newUser.email,
      access_token: this.jwtService.sign(payload),
    };
  }
}
