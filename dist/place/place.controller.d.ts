/// <reference types="multer" />
import { createActivityDto, createPlaceDto, updatePlaceDto } from "./place.dto";
import { PlaceService } from "./place.service";
import { CdnService } from "src/cdn/cdn.service";
export declare class PlaceController {
    private placeService;
    private cdnService;
    constructor(placeService: PlaceService, cdnService: CdnService);
    getAll(res: any): Promise<void>;
    getMerchantPlaces(id: string, res: any): Promise<void>;
    getById(id: string, res: any): Promise<void>;
    getByCategory(categoryId: string, res: any): Promise<void>;
    searchPlaces(name: string, res: any): Promise<void>;
    getActivities(id: string, res: any): Promise<void>;
    create(body: createPlaceDto, req: any, res: any, files: Array<Express.Multer.File>): Promise<void>;
    createActivity(id: string, body: createActivityDto, req: any, res: any, files: Array<Express.Multer.File>): Promise<void>;
    update(id: string, body: updatePlaceDto, req: any, res: any, files: Array<Express.Multer.File>): Promise<void>;
    delete(id: string, res: any): Promise<void>;
}
