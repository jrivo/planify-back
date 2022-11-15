import { Role } from "@prisma/client";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

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

  @IsOptional()
  @IsString()
  role?: Role;
  // address : Address
}
