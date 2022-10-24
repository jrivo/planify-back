import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TripModule } from './trip/trip.module';
import { ReviewModule } from './review/review.module';
import { PlaceModule } from './place/place.module';
import { ActivityModule } from './activity/activity.module';
import { PlaceTypeModule } from './place-type/place-type.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, TripModule, ReviewModule, PlaceModule, ActivityModule, PlaceTypeModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
