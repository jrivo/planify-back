import { createTripDto, updateTripDto } from "./trip.dto";
export declare class TripService {
    getAll(): Promise<any>;
    getUserAll(id: string): Promise<any>;
    getById(id: string): Promise<any>;
    getByName(name: string): Promise<any>;
    create(req: any, body: createTripDto): Promise<any>;
    update(id: string, body: updateTripDto): Promise<any>;
    delete(id: string): Promise<any>;
    addActivity(tripId: string, activityId: string): Promise<any>;
}
