import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  Param,
  Res,
  Delete,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { createPlaceTypeDto } from "./place-type.dto";
import { PlaceTypeService } from "./place-type.service";

@Controller("place-types")
export class PlaceTypeController {
  constructor(private placeTypeService: PlaceTypeService) {}

  @Get()
  async getAll(@Res() res) {
    this.placeTypeService.getAll().then((placeTypes) => {
      res.status(200).send(placeTypes);
    }).catch((err) => {
      res.status(500).send(err);
    });
  }

  @Get(":id")
  async getById(@Param("id") id: string, @Res() res) {
    this.placeTypeService
      .getById(id)
      .then((place) => {
        place
          ? res.status(200).send(place)
          : res.status(404).send("Place type not found");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("ADMIN")
  @Post()
  async create(@Body() body: createPlaceTypeDto, @Request() req: any) {
    return this.placeTypeService.create(req, body);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("ADMIN")
  @Delete(":id")
  async delete(@Param("id") id: string, @Res() res) {
    this.placeTypeService
      .delete(id)
      .then(() => {
        res.status(202).send("Place type deleted");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}
