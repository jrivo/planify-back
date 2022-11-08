import { createActivityDto, createPlaceDto, updatePlaceDto } from "./place.dto";
export declare class PlaceService {
    getAll(): Promise<any>;
    getById(id: string): Promise<any>;
    getByName(name: string): Promise<any>;
    getByCategory(categoryId: string): Promise<any>;
    create(req: any, body: createPlaceDto): Promise<any>;
    update(id: string, req: any, body: updatePlaceDto): Promise<any>;
    delete(id: string): Promise<any>;
    getActivities(id: string): Promise<any>;
    createActivity(id: string, req: any, body: createActivityDto): Promise<any>;
}
