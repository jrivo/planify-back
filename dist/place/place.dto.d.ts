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
    googleAddressId?: string;
    latitude?: string;
    longitude?: string;
    website?: string;
    phone?: string;
    email?: string;
    placeTypeId: string;
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
    googleAddressId?: string;
    latitude?: string;
    longitude?: string;
    website?: string;
    phone?: string;
    email?: string;
    placeTypeId?: string;
    activities?: Activity[];
    mainImage?: any;
    images?: any;
    documents?: any;
}
export declare class createActivityDto {
    name: string;
    description: string;
    price?: string;
    date: Date;
    mainImage?: any;
    images?: any;
    documents?: any;
    street?: string;
    streetNumber?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    region?: string;
    googleAddressId?: string;
    latitude?: string;
    longitude?: string;
}
export declare class getPlacesParamsDto {
    page: number;
    limit: number;
    merchant: number;
    search: string;
    category: string;
}
export declare class getPlaceActivitiesParamsDto {
    page: number;
    limit: number;
    search: string;
}
