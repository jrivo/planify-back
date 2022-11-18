import { updateActivityDto } from "./activity.dto";
export declare class ActivityService {
    getAll(): Promise<any>;
    getById(id: string): Promise<any>;
    getByName(name: string): Promise<any>;
    getByCategory(categoryId: string): Promise<any>;
    update(id: string, req: any, body: updateActivityDto): Promise<void>;
    delete(id: string): Promise<any>;
}
