import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // const user = await prisma.user.findUnique({
    //   where: { id: payload.sub },
    // });
    // return { id: user.id, email: user.email };
    return { id: payload.sub };
  }
}
