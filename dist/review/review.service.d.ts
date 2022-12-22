import { createReviewDto, getReviewsParamsDto, updateReviewDto } from "./review.dto";
export declare class ReviewService {
    getAll(queries: getReviewsParamsDto): Promise<{
        reviews: any;
        totalPages: number;
    }>;
    getById(id: string): Promise<any>;
    create(req: any, body: createReviewDto): Promise<any>;
    update(id: string, req: any, body: updateReviewDto): Promise<void>;
    delete(id: string): Promise<any>;
    getOwnerId(id: string): Promise<any>;
}
