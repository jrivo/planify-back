import { createPlaceDto } from "./place.dto";
import { PlaceService } from "./place.service";
export declare class PlaceController {
    private placeService;
    constructor(placeService: PlaceService);
    getAll(res: any): Promise<void>;
    getById(id: string, res: any): Promise<void>;
    getByName(name: string, res: any): Promise<void>;
    create(body: createPlaceDto, req: any): Promise<any>;
}
