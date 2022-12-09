import { Activity} from "@prisma/client";
import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class createPlaceDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    street: string;

    @IsNotEmpty()
    @IsString()
    streetNumber: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    postalCode: string;


    @IsNotEmpty()
    @IsString()
    country: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    region?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    googleAddressId?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    latitude?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    longitude?: string;

    @IsOptional()
    @IsString()
    website?: string;

    @IsOptional()
    @IsPhoneNumber() 
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsNotEmpty()
    @IsString()
    placeTypeId: string;

    @IsOptional()
    activities?: Activity[];

    @IsOptional()
    mainImage? : any;

    @IsOptional()
    images? : any;

    @IsOptional()
    documents? : any;
}

export class updatePlaceDto {

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    street?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    streetNumber?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    city?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    postalCode?: string;


    @IsOptional()
    @IsNotEmpty()
    @IsString()
    country?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    region?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    googleAddressId?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    latitude?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    longitude?: string;

    @IsOptional()
    @IsString()
    website?: string;

    @IsOptional()
    @IsPhoneNumber() 
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    placeTypeId?: string;

    @IsOptional()
    activities?: Activity[];

    @IsOptional()
    mainImage? : any;

    @IsOptional()
    images? : any;

    @IsOptional()
    documents? : any;
}

export class createActivityDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    price?: string;

    @IsDateString()
    @IsNotEmpty()
    date: Date;

    @IsOptional()
    mainImage? : any;

    @IsOptional()
    images? : any;

    @IsOptional()
    documents? : any;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    street?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    streetNumber?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    city?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    postalCode?: string;


    @IsOptional()
    @IsNotEmpty()
    @IsString()
    country?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    region?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    googleAddressId?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    latitude?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    longitude?: string;
}