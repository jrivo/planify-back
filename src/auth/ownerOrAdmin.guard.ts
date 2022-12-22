import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { ActivityService } from "src/activity/activity.service";
import { PlaceService } from "src/place/place.service";
import { ReviewService } from "src/review/review.service";
import { UsersService } from "src/user/users.service";

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
    private placeService: PlaceService,
    private activityService: ActivityService,
    private reviewService: ReviewService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return false;
    }
    let user = await this.usersService.findById(request.user.id);
    let isAdmin = user.role === Role.ADMIN;
    if (isAdmin) {
      return true;
    }
    let service = null;
    switch (this.reflector.get<string>("entity", context.getHandler())) {
      case "place":
        service = this.placeService;
        break;
      case "activity":
        service = this.activityService;
        break;
      case "review":
        service = this.reviewService;
    }
    // console.log(await service.getOwnerId(request.params.id), request.user.id);
    if ((await service.getOwnerId(request.params.id)) === request.user.id) {
      return true;
    } else {
      return false;
    }
  }
}
