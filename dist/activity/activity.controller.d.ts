/// <reference types="multer" />
import { ActivityService } from "./activity.service";
import { updateActivityDto } from "./activity.dto";
import { CdnService } from "src/cdn/cdn.service";
export declare class ActivityController {
    private activityService;
    private cdnService;
    constructor(activityService: ActivityService, cdnService: CdnService);
    getAll(res: any): Promise<void>;
    getById(id: string, res: any): Promise<void>;
    getByCategory(categoryId: string, res: any): Promise<void>;
    getByName(name: string, res: any): Promise<void>;
    update(id: string, body: updateActivityDto, req: any, res: any, files: Array<Express.Multer.File>): Promise<void>;
    delete(id: string, res: any): Promise<void>;
}
