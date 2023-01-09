import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from "@nestjs/common";
import { UsersService } from "src/user/users.service";
@Injectable()
export class NotBannedGuard implements CanActivate {
  constructor(private usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request?.user) {
      if ((await this.usersService.getStatus(request.user.id)) === "BANNED") {
        throw new HttpException("You have been banned", 403);
      }
    }
    return true;
  }
}
