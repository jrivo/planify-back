import { createPlaceTypeDto } from './place-type.dto';
export declare class PlaceTypeService {
    getAll(): Promise<any>;
    getById(id: string): Promise<any>;
    create(req: any, body: createPlaceTypeDto): Promise<any>;
    delete(id: string): Promise<any>;
}
