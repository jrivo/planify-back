import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TripModule } from "./trip/trip.module";
import { ReviewModule } from "./review/review.module";
import { PlaceModule } from "./place/place.module";
import { ActivityModule } from "./activity/activity.module";
import { PlaceTypeModule } from "./place-type/place-type.module";
import { UsersModule } from "./user/users.module";
import { AuthController } from "./auth/auth.controller";
import { PlaceController } from "./place/place.controller";
import { AuthService } from "./auth/auth.service";
import { PlaceService } from "./place/place.service";
import { UsersController } from "./user/users.controller";
import { UsersService } from "./user/users.service";
import { PlaceTypeController } from "./place-type/place-type.controller";
import { PlaceTypeService } from "./place-type/place-type.service";
import { ActivityController } from "./activity/activity.controller";
import { ActivityService } from "./activity/activity.service";
import { TripService } from "./trip/trip.service";
import { TripController } from "./trip/trip.controller";
import { CdnService } from "./cdn/cdn.service";
import { JwtService } from "@nestjs/jwt";
import { ReviewController } from "./review/review.controller";
import { ReviewService } from "./review/review.service";
import { EmailVerificationController } from "./email-verification/email-verification.controller";
import { EmailVerificationModule } from "./email-verification/email-verification.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TripModule,
    ReviewModule,
    PlaceModule,
    ActivityModule,
    PlaceTypeModule,
    UsersModule,
    EmailVerificationModule
  ],
  controllers: [
    AppController,
    AuthController,
    PlaceController,
    UsersController,
    PlaceTypeController,
    ActivityController,
    TripController,
    ReviewController,
    EmailVerificationController
  ],
  providers: [
    AppService,
    PlaceService,
    UsersService,
    PlaceTypeService,
    ActivityService,
    TripService,
    CdnService,
    AuthService,
    JwtService,
    ReviewService,
  ],
})
export class AppModule {}
