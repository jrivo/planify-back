import { createActivityDto, createPlaceDto, getPlaceActivitiesParamsDto, getPlacesParamsDto, updatePlaceDto } from "./place.dto";
export declare class PlaceService {
    getAll(queries: getPlacesParamsDto): Promise<{
        places: any;
        totalPages: number;
    }>;
    getById(id: string): Promise<any>;
    create(req: any, body: createPlaceDto): Promise<any>;
    update(id: string, req: any, body: updatePlaceDto): Promise<any>;
    delete(id: string): Promise<any>;
    getActivities(id: string, queries: getPlaceActivitiesParamsDto): Promise<{
        activities: any;
        totalPages: number;
    }>;
    createActivity(id: string, req: any, body: createActivityDto): Promise<any>;
    getOwnerId(id: string): Promise<any>;
}
