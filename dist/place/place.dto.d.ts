import { Activity, Address } from "@prisma/client";
export declare class createPlaceDto {
    name: string;
    description?: string;
    address: Address;
    website?: string;
    phone?: string;
    email?: string;
    placeTypeId: number;
    activities?: Activity[];
    mainImage?: any;
    images?: any;
    documents?: any;
}
export declare class updatePlaceDto {
    name?: string;
    description?: string;
    address?: Address;
    website?: string;
    phone?: string;
    email?: string;
    placeTypeId?: number;
    activities?: Activity[];
    mainImage?: any;
    images?: any;
    documents?: any;
}
