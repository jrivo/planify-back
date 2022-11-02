import { Activity, Address } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class createPlaceDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description?: string;

    @IsNotEmpty()
    address: Address;

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
    @IsNumber()
    placeTypeId: number;

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
    address?: Address;

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
    @IsNumber()
    placeTypeId?: number;

    @IsOptional()
    activities?: Activity[];

    @IsOptional()
    mainImage? : any;

    @IsOptional()
    images? : any;

    @IsOptional()
    documents? : any;
}