import { Activity } from "@prisma/client";
export declare class createPlaceDto {
    name: string;
    description?: string;
    street: string;
    streetNumber: string;
    city: string;
    postalCode: string;
    country: string;
    region?: string;
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
    street?: string;
    streetNumber?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    region?: string;
    website?: string;
    phone?: string;
    email?: string;
    placeTypeId?: number;
    activities?: Activity[];
    mainImage?: any;
    images?: any;
    documents?: any;
}
export declare class createActivityDto {
    name: string;
    description: string;
    price?: string;
    date?: Date;
    mainImage?: any;
    images?: any;
    documents?: any;
}
