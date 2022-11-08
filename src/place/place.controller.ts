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
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { createActivityDto, createPlaceDto, updatePlaceDto } from "./place.dto";
import { PlaceService } from "./place.service";
import { prismaErrorHandler } from "src/prisma/errorsHandler";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { CdnService } from "src/cdn/cdn.service";

@Controller("places")
export class PlaceController {
  constructor(private placeService: PlaceService,private cdnService: CdnService) {}

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

  @Get(":id/activities")
  async getActivities(@Param("id") id: string, @Res() res) {
    this.placeService
      .getActivities(id)
      .then((activities) => {
        res.status(200).send(activities);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MERCHANT")
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() body: createPlaceDto,
    @Request() req: any,
    @Res() res,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    files ? req = await this.cdnService.upload(req,files) : null
    this.placeService
      .create(req, body)
      .then((place) => {
        res.status(201).send(place);
      })
      .catch((err) => {
        res.status(500).send(prismaErrorHandler(err));
      });
  }

  @Post(":id/activities")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MERCHANT")
  @UseInterceptors(AnyFilesInterceptor())
  //add owner or admin guard
  async createActivity(
    @Param("id") id: string,
    @Body() body: createActivityDto,
    @Request() req: any,
    @Res() res,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    files ? req = await this.cdnService.upload(req,files) : null
    this.placeService
      .createActivity(id, req, body)
      .then((activity) => {
        res.status(201).send(activity);
      })
      .catch((err) => {
        res.status(500).send(prismaErrorHandler(err));
      });
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MERCHANT")
  @UseInterceptors(AnyFilesInterceptor())
  //add owner or admin guard
  async update(
    @Param("id") id: string,
    @Body() body: updatePlaceDto,
    @Request() req: any,
    @Res() res,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    files ? req = await this.cdnService.upload(req,files) : null
    this.placeService
      .update(id, req,body)
      .then((place) => {
        res.status(202).send(place);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MERCHANT")
  //add owner or admin guard
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
