import { Address } from "@prisma/client";
import { IsAlphanumeric, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

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
  phoneNumber: string;

  // @IsNotEmpty()
  // @IsString()
  // street: string;

  // @IsNotEmpty()
  // @IsString()
  // streetNumber: string;

  // @IsNotEmpty()
  // @IsString()
  // city: string;

  // @IsNotEmpty()
  // @IsString()
  // postalCode: string;

  // @IsNotEmpty()
  // @IsString()
  // country: string;

  // @IsOptional()
  // @IsString()
  // region?: string;
  address : Address

}