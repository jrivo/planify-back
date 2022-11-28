import { TripService } from "./trip.service";
import { createTripDto, updateTripDto } from "./trip.dto";
export declare class TripController {
    private tripService;
    constructor(tripService: TripService);
    getAll(req: any, res: any): Promise<void>;
    getById(id: string, res: any): Promise<void>;
    getByName(name: string, res: any): Promise<void>;
    create(req: any, body: createTripDto, res: any): Promise<void>;
    getActivities(id: string, res: any): Promise<void>;
    addActivity(id: string, body: any, res: any): Promise<void>;
    removeActivity(id: string, body: any, res: any): Promise<void>;
    update(id: string, body: updateTripDto, res: any): Promise<void>;
    delete(id: string, res: any): Promise<void>;
}
