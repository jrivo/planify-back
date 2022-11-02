import { IsNotEmpty, IsString } from "class-validator";

export class createPlaceTypeDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}