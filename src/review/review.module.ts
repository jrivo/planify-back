import { Module } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { ReviewController } from "./review.controller";
import { UsersModule } from "src/user/users.module";
import { PlaceModule } from "src/place/place.module";
import { ActivityModule } from "src/activity/activity.module";
import { CdnModule } from "src/cdn/cdn.module";
import { EventModule } from "src/event/event.module";
import { TripModule } from "src/trip/trip.module";

@Module({
  imports: [UsersModule, PlaceModule, ActivityModule, CdnModule,EventModule,TripModule],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports: [ReviewService],
})
export class ReviewModule {}
