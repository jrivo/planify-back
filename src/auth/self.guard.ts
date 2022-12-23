import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return false;
    }
    return request.user.id == request.params.id;
  }
}
