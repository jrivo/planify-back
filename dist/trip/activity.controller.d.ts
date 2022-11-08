import { ActivityService } from "./activity.service";
import { updateActivityDto } from "./activity.dto";
export declare class ActivityController {
    private activityService;
    constructor(activityService: ActivityService);
    getAll(res: any): Promise<void>;
    getById(id: string, res: any): Promise<void>;
    getByCategory(categoryId: string, res: any): Promise<void>;
    getByName(name: string, res: any): Promise<void>;
    update(id: string, body: updateActivityDto, req: any, res: any): Promise<void>;
    delete(id: string, res: any): Promise<void>;
}
