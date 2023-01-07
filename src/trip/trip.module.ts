import { Module } from '@nestjs/common';
import { EventModule } from 'src/event/event.module';
import { TripService } from './trip.service';

@Module({
  imports: [EventModule],
  providers: [TripService]
})
export class TripModule {}
