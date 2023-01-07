import { ApiPropertyOptional } from "@nestjs/swagger";

export class getEventsParamsDto {
    @ApiPropertyOptional()
    page: number;
  
    @ApiPropertyOptional()
    limit: number;
  
    @ApiPropertyOptional()
    merchant: number;
  }