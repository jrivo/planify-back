import { updateActivityDto } from "./activity.dto";
export declare class ActivityService {
    getAll(): Promise<any>;
    getById(id: string): Promise<any>;
    getByName(name: string): Promise<any>;
    getByCategory(categoryId: string): Promise<any>;
    getMerchantActivities(id: string): Promise<any>;
    getActivitySubscribers(id: string): Promise<any>;
    update(id: string, req: any, body: updateActivityDto): Promise<any>;
    delete(id: string): Promise<any>;
    getOwnerId(id: string): Promise<any>;
}
