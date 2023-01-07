import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { UsersService } from "src/user/users.service";
@Injectable()
export class NotBlockedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request?.user) {
      // return (await this.usersService.getStatus(request.user.id)) !== "BLOCKED";
      if ((await this.usersService.getStatus(request.user.id)) === "BLOCKED") {
        throw new HttpException("You are blocked", 403);
      }
    }
    return true;
  }
}
