/// <reference types="multer" />
import { createActivityDto, createPlaceDto, getPlaceActivitiesParamsDto, getPlacesParamsDto, updatePlaceDto } from "./place.dto";
import { PlaceService } from "./place.service";
import { CdnService } from "src/cdn/cdn.service";
export declare class PlaceController {
    private placeService;
    private cdnService;
    constructor(placeService: PlaceService, cdnService: CdnService);
    getAll(res: any, queries: getPlacesParamsDto): Promise<void>;
    getById(id: string, res: any): Promise<void>;
    getActivities(id: string, res: any, queries: getPlaceActivitiesParamsDto): Promise<void>;
    create(body: createPlaceDto, req: any, res: any, files: Array<Express.Multer.File>): Promise<void>;
    createActivity(id: string, body: createActivityDto, req: any, res: any, files: Array<Express.Multer.File>): Promise<void>;
    update(id: string, body: updatePlaceDto, req: any, res: any, files: Array<Express.Multer.File>): Promise<void>;
    delete(id: string, res: any): Promise<void>;
}
