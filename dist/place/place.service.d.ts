import { createActivityDto, createPlaceDto, updatePlaceDto } from "./place.dto";
export declare class PlaceService {
    getAll(categoryId: string, page: number, limit: number, defaultLimit: number): Promise<{
        places: any;
        totalPages: number;
    }>;
    getMerchantPlaces(id: string, categoryId: string, page: number, limit: number, defaultLimit: number): Promise<{
        places: any;
        totalPages: number;
    }>;
    getById(id: string): Promise<any>;
    searchPlaces(searchString: string, categoryId: string, page: number, limit: number, defaultLimit: number): Promise<{
        places: any;
        totalPages: number;
    }>;
    getByCategory(categoryId: string): Promise<any>;
    create(req: any, body: createPlaceDto): Promise<any>;
    update(id: string, req: any, body: updatePlaceDto): Promise<any>;
    delete(id: string): Promise<any>;
    getActivities(id: string): Promise<any>;
    createActivity(id: string, req: any, body: createActivityDto): Promise<any>;
    getOwnerId(id: string): Promise<any>;
}
