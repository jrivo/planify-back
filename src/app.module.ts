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
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./auth/roles.guard";

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
  ],
  controllers: [
    AppController,
    AuthController,
    PlaceController,
    UsersController,
    PlaceTypeController,
  ],
  providers: [
    AppService,
    PlaceService,
    UsersService,
    PlaceTypeService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
