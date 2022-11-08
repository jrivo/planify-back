import { createActivityDto, createPlaceDto, updatePlaceDto } from "./place.dto";
import { PlaceService } from "./place.service";
export declare class PlaceController {
    private placeService;
    constructor(placeService: PlaceService);
    getAll(res: any): Promise<void>;
    getById(id: string, res: any): Promise<void>;
    getByCategory(categoryId: string, res: any): Promise<void>;
    getByName(name: string, res: any): Promise<void>;
    getActivities(id: string, res: any): Promise<void>;
    create(body: createPlaceDto, req: any, res: any): Promise<void>;
    createActivity(id: string, body: createActivityDto, req: any, res: any): Promise<void>;
    update(id: string, body: updatePlaceDto, req: any, res: any): Promise<void>;
    delete(id: string, res: any): Promise<void>;
}
