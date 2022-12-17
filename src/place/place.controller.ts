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
  Query,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import {
  createActivityDto,
  createPlaceDto,
  getPlaceActivitiesParamsDto,
  getPlacesParamsDto,
  updatePlaceDto,
} from "./place.dto";
import { PlaceService } from "./place.service";
import { prismaErrorHandler } from "src/prisma/errorsHandler";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { CdnService } from "src/cdn/cdn.service";
import { redeserialize } from "src/utils";
import { OwnerOrAdminGuard } from "src/auth/ownerOrAdmin.guard";
import { Entity } from "src/auth/ownerOrAdmin.decorator";

@Controller("places")
export class PlaceController {
  constructor(
    private placeService: PlaceService,
    private cdnService: CdnService
  ) {}

  @Get()
  //TODO: combine search with merchant
  async getMutiple(@Res() res, @Query() queries: getPlacesParamsDto) {
    const page = queries.page ? queries.page : null;
    const limit = queries.limit ? queries.limit : null;
    const merchantId = queries.merchant ? queries.merchant : null;
    const search = queries.search ? queries.search : null;
    const categoryId = queries.category ? queries.category : null;
    if (merchantId) {
      return this.getMerchantPlaces(merchantId.toString(), categoryId,res, page, limit);
    } else if (search) {
      return this.searchPlaces(search,categoryId, res, page, limit);
    } else {
      this.placeService
        .getAll(categoryId,page, limit, 10)
        .then((places) => {
          res.status(200).send(places);
        })
        .catch((err) => {
          res.status(500).send(prismaErrorHandler(err));
        });
    }
  }

  //TODO: not use prefix /places for the route
  // @Get("/merchant/:id")
  async getMerchantPlaces(id: string, categoryId:string,res, page: number, limit: number) {
    this.placeService
      .getMerchantPlaces(id, categoryId,page, limit, 10)
      .then((places) => {
        res.status(200).send(places);
      })
      .catch((err) => {
        res.status(500).send(prismaErrorHandler(err));
      });
  }

  @Get(":id")
  async getById(@Param("id") id: string, @Res() res) {
    this.placeService
      .getById(id)
      .then((place) => {
        console.log(place);
        place
          ? res.status(200).send(place)
          : res.status(404).send("Place not found");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  }

  // @Get("category/:id")
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

  // @Get("search/:name")
  async searchPlaces(name: string, categoryId:string,res, page: number, limit: number) {
    this.placeService
      .searchPlaces(name, categoryId,page, limit, 10)
      .then((places) => {
        if (!places) {
          res.status(404).send("Place not found");
        }
        places.places = places.places.map((place) => {
          return redeserialize(
            place,
            [
              {
                data: place.type.name,
                newKey: "placeType",
              },
            ],
            ["type"]
          );
        });
        res.status(200).send(places);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Get(":id/activities")
  async getActivities(@Param("id") id: string, @Res() res,@Query() queries: getPlaceActivitiesParamsDto) {
    const page = queries.page ? queries.page : null;
    const limit = queries.limit ? queries.limit : null;
    const search = queries.search ? queries.search : null;
    this.placeService
      .getActivities(id,search,page, limit, 10)
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
    files ? (req = await this.cdnService.upload(req, files)) : null;
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
  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @Entity("place")
  //add owner or admin guard
  async createActivity(
    @Param("id") id: string,
    @Body() body: createActivityDto,
    @Request() req: any,
    @Res() res,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    files ? (req = await this.cdnService.upload(req, files)) : null;
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
  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
  @Entity("place")
  @UseInterceptors(AnyFilesInterceptor())
  //add owner or admin guard
  async update(
    @Param("id") id: string,
    @Body() body: updatePlaceDto,
    @Request() req: any,
    @Res() res,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    files ? (req = await this.cdnService.upload(req, files)) : null;
    this.placeService
      .update(id, req, body)
      .then((place) => {
        res.status(202).send(place);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
  @Entity("place")
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
