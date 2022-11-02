import { createPlaceDto, updatePlaceDto } from "./place.dto";
export declare class PlaceService {
    getAll(): Promise<any>;
    getById(id: string): Promise<any>;
    getByName(name: string): Promise<any>;
    getByCategory(categoryId: string): Promise<any>;
    create(req: any, body: createPlaceDto): Promise<any>;
    update(id: string, body: updatePlaceDto): Promise<any>;
    delete(id: string): any;
}
