import { ActivityService } from "src/activity/activity.service";
import { EventService } from "src/event/event.service";
import { PlaceService } from "src/place/place.service";
import { createReviewDto, getReviewsParamsDto, updateReviewDto } from "./review.dto";
export declare class ReviewService {
    private placeService;
    private activityService;
    private eventService;
    constructor(placeService: PlaceService, activityService: ActivityService, eventService: EventService);
    getAll(queries: getReviewsParamsDto): Promise<{
        reviews: any;
        totalPages: number;
    }>;
    getById(id: string): Promise<any>;
    create(req: any, body: createReviewDto): Promise<any>;
    update(id: string, req: any, body: updateReviewDto): Promise<any>;
    delete(id: string): Promise<any>;
    getOwnerId(id: string): Promise<any>;
}
