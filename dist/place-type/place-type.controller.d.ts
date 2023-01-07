import { createPlaceTypeDto } from "./place-type.dto";
import { PlaceTypeService } from "./place-type.service";
export declare class PlaceTypeController {
    private placeTypeService;
    constructor(placeTypeService: PlaceTypeService);
    getAll(res: any): Promise<void>;
    getById(id: string, res: any): Promise<void>;
    delete(id: string, res: any): Promise<void>;
    create(body: createPlaceTypeDto, req: any): Promise<any>;
}
