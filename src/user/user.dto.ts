import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class updateUserDto {

    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    email?: string;
  
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    password?: string;
  
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    firstName?: string;
  
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastName?: string;
  
    @IsOptional()
    @IsPhoneNumber()
    phoneNumber?: string;
  
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
    @IsString()
    region?: string;
  }

  export class GetUsersParamsDto {
    @ApiPropertyOptional()
    page: number;
  
    @ApiPropertyOptional()
    limit: number;
  
    @ApiPropertyOptional()
    search: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsIn(["admin", "user","moderator"])
    role: string;
  }