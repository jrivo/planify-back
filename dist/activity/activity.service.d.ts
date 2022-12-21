import { getActivitiesParamsDto, updateActivityDto } from "./activity.dto";
export declare class ActivityService {
    getAll(queries: getActivitiesParamsDto): Promise<{
        activities: any;
        totalPages: number;
    }>;
    getById(id: string): Promise<any>;
    searchActivities(queries: getActivitiesParamsDto): Promise<{
        activities: any;
        totalPages: number;
    }>;
    getByCategory(categoryId: string): Promise<any>;
    getMerchantActivities(queries: getActivitiesParamsDto): Promise<{
        activities: any;
        totalPages: number;
    }>;
    getActivitySubscribers(id: string): Promise<any>;
    update(id: string, req: any, body: updateActivityDto): Promise<any>;
    delete(id: string): Promise<any>;
    getOwnerId(id: string): Promise<any>;
}
