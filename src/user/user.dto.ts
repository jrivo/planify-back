import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";

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

  export class changeUserRoleDto{
    @IsNotEmpty()
    @IsIn(["ADMIN", "USER","MODERATOR","MERCHANT"])
    role: string;
  }

  export class updateUserStatusDto{
    @IsNotEmpty()
    @IsIn(["BLOCKED","BANNED","VERIFIED"])
    status: string;
  }

  export class updatePasswordDto{
    @IsNotEmpty()
    @IsString()
    @Length(8)
    password: string;
  }