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
  Put,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { createPlaceDto, updatePlaceDto } from "./place.dto";
import { PlaceService } from "./place.service";
import { prismaErrorHandler } from "src/prisma/errorsHandler";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@Controller("places")
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @Get()
  async getAll(@Res() res) {
    this.placeService
      .getAll()
      .then((places) => {
        res.status(200).send(places);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Get(":id")
  @Roles("MERCHANT")
  async getById(@Param("id") id: string, @Res() res) {
    this.placeService
      .getById(id)
      .then((place) => {
        place
          ? res.status(200).send(place)
          : res.status(404).send("Place not found");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Get("category/:id")
  async getByCategory(@Param("id") categoryId: string, @Res() res) {
    this.placeService
      .getByCategory(categoryId)
      .then((places) => {
        res.status(200).send(places);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Get("search/:name")
  async getByName(@Param("name") name: string, @Res() res) {
    this.placeService
      .getByName(name)
      .then((place) => {
        place
          ? res.status(200).send(place)
          : res.status(404).send("Place not found");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  // @Roles("MERCHANT")
  @Post()
  async create(@Body() body: createPlaceDto, @Request() req: any, @Res() res) {
    this.placeService
      .create(req, body)
      .then((place) => {
        res.status(201).send(place);
      })
      .catch((err) => {
        res.status(500).send(prismaErrorHandler(err));
      });
  }

  @UseGuards()
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() body: updatePlaceDto,
    @Request() req: any,
    @Res() res
  ) {
    this.placeService
      .update(id, body)
      .then((place) => {
        res.status(202).send(place);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: string, @Res() res) {
    this.placeService
      .delete(id)
      .then(() => {
        res.status(202).send();
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}
