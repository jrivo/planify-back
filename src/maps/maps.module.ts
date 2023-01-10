import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/users.module';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';

@Module({
  imports: [UsersModule],
  providers: [MapsService],
  controllers: [MapsController],
  exports: [MapsService],
})
export class MapsModule {}
