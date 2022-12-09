import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class updateActivityDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    price?: string;

    @IsOptional()
    @IsDateString()
    @IsNotEmpty()
    date?: Date;

    @IsOptional()
    mainImage? : any;

    @IsOptional()
    images? : any;

    @IsOptional()
    documents? : any;
}