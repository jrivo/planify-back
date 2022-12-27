import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from 'src/activity/activity.service';
import { PlaceService } from 'src/place/place.service';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewService,PlaceService,ActivityService],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
