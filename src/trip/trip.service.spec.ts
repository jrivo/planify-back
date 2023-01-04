import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from 'src/event/event.service';
import { TripService } from './trip.service';

describe('TripService', () => {
  let service: TripService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripService,EventService],
    }).compile();

    service = module.get<TripService>(TripService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
