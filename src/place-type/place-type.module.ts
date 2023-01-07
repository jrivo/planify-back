import { Module } from '@nestjs/common';
import { PlaceTypeService } from './place-type.service';

@Module({
  providers: [PlaceTypeService]
})
export class PlaceTypeModule {}
