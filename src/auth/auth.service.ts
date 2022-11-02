import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/user/users.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaClient } from "@prisma/client";
import { RegisterDto } from "./auth.dto";
import { BCRYPT_SALT_ROUNDS } from "../const";
import * as bcrypt from "bcrypt";

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

  async register(body: RegisterDto) {
    const user = await this.usersService.findByEmail(body.email);
    if (user) {
      throw new UnauthorizedException("User already exists");
    }
    let address = await prisma.address.create({
      data: {
        street: body.address.street,
        streetNumber: body.address.streetNumber,
        city: body.address.city,
        postalCode: body.address.postalCode,
        country: body.address.country,
        region: body.address.region && body.address.region,
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
      },
    });
    //media creation
    const payload = { sub: user.id, email: user.email };
    return {
      id: user.id,
      email: user.email,
      access_token: this.jwtService.sign(payload),
    };
  }
}
