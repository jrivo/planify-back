import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

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
  mainImage?: any;

  @IsOptional()
  images?: any;

  @IsOptional()
  documents?: any;
}

export class getActivitiesParamsDto {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  limit: number;

  @ApiPropertyOptional()
  merchant: number;

  @ApiPropertyOptional()
  category: string;

  @ApiPropertyOptional()
  search: string;
}
