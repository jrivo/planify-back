import { updateActivityDto } from "./activity.dto";
export declare class ActivityService {
    getAll(categoryId: string, page: number, limit: number, defaultLimit: number): Promise<{
        activities: any;
        totalPages: number;
    }>;
    getById(id: string): Promise<any>;
    searchActivities(searchString: string, categoryId: string, page: number, limit: number, defaultLimit: number): Promise<{
        activities: any;
        totalPages: number;
    }>;
    getByCategory(categoryId: string): Promise<any>;
    getMerchantActivities(id: string, categoryId: string, page: number, limit: number, defaultLimit: number): Promise<{
        activities: any;
        totalPages: number;
    }>;
    getActivitySubscribers(id: string): Promise<any>;
    update(id: string, req: any, body: updateActivityDto): Promise<any>;
    delete(id: string): Promise<any>;
    getOwnerId(id: string): Promise<any>;
}
