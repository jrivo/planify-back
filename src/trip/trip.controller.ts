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
import { prismaErrorHandler } from "src/prisma/errorsHandler";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { TripService } from "./trip.service";
import { createTripDto, updateTripDto } from "./trip.dto";

@Controller("trips")
export class TripController {
  constructor(private tripService: TripService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Request() req,@Res() res) {
    //TODO: use roles to define if the user is an admin or not
    // this.tripService
    //   .getAll()
    //   .then((trips) => {
    //     res.status(200).send(trips);
    //   })
    //   .catch((err) => {
    //     res.status(500).send(err);
    //   });

      this.tripService
      .getUserAll(req.user.id)
      .then((trips) => {
        res.status(200).send(trips);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Get(":id")
  async getById(@Param("id") id: string, @Res() res) {
    this.tripService
      .getById(id)
      .then((trip) => {
        trip
          ? res.status(200).send(trip)
          : res.status(404).send("Trip not found");
      })
      .catch((err) => {
        res.status(500).send(prismaErrorHandler(err));
      });
  }

  @Get("search/:name")
  async getByName(@Param("name") name: string, @Res() res) {
    this.tripService
      .getByName(name)
      .then((trips) => {
        res.status(200).send(trips);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  async create(@Request() req: any, @Body() body: createTripDto, @Res() res) {
    this.tripService
      .create(req, body)
      .then((trip) => {
        res.status(201).send(trip);
      })
      .catch((err) => {
        res.status(500).send(prismaErrorHandler(err));
      });
  }

  @Get(":id/activities")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("ADMIN","USER")
  async getActivities(@Param("id") id: string, @Res() res) {
    this.tripService
      .getActivities(id)
      .then((activities) => {
        res.status(200).send(activities);
      })
      .catch((err) => {
        res
          .status(500)
          .send(prismaErrorHandler(err));
      });
  }

  @Post(":id/activities")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  async addActivity(@Param("id") id: string,@Body() body, @Res() res) {
    this.tripService
      .addActivity(id,body.activityId)
      .then((trip) => {
        res.status(200).send(trip);
      })
      .catch((err) => {
        res.status(500).send(prismaErrorHandler(err));
      });
  }

  @Put(":id/activities")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  async removeActivity(@Param("id") id: string,@Body() body, @Res() res) {
    this.tripService
      .removeActivity(id,body.activityId)
      .then((trip) => {
        res.status(200).send(trip);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  async update(
    @Param("id") id: string,
    @Body() body: updateTripDto,
    @Res() res
  ) {
    this.tripService
      .update(id, body)
      .then((trip) => {
        res.status(200).send(trip);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  async delete(@Param("id") id: string, @Res() res) {
    this.tripService
      .delete(id)
      .then((trip) => {
        res.status(202).send();
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}
