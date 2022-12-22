import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

export class createReviewDto {
  @IsNumberString()
  @IsNotEmpty()
  placeId: string;

  @IsNumberString()
  @IsNotEmpty()
  @IsIn(["1", "2", "3", "4", "5"])
  rating: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  images?: any;
}

export class updateReviewDto {
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  @IsIn(["1", "2", "3", "4", "5"])
  rating?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  images?: any;
}

export class getReviewsParamsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  place?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit?: number;
}
