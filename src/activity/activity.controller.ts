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
import { ActivityService } from "./activity.service";
import { updateActivityDto } from "./activity.dto";

@Controller("activities")
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Get()
  async getAll(@Res() res) {
    this.activityService
      .getAll()
      .then((actiities) => {
        res.status(200).send(actiities);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Get(":id")
  async getById(@Param("id") id: string, @Res() res) {
    this.activityService
      .getById(id)
      .then((activity) => {
        activity
          ? res.status(200).send(activity)
          : res.status(404).send("Activity not found");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Get("category/:id")
  async getByCategory(@Param("id") categoryId: string, @Res() res) {
    this.activityService
      .getByCategory(categoryId)
      .then((activities) => {
        res.status(200).send(activities);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Get("search/:name")
  async getByName(@Param("name") name: string, @Res() res) {
    this.activityService
      .getByName(name)
      .then((activity) => {
        activity
          ? res.status(200).send(activity)
          : res.status(404).send("Activity not found");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MERCHANT")
  //add owner or admin guard
  async update(
    @Param("id") id: string,
    @Body() body: updateActivityDto,
    @Request() req: any,
    @Res() res
  ) {
    this.activityService
      .update(id, body)
      .then((activity) => {
        res.status(202).send(activity);
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
    this.activityService
      .delete(id)
      .then(() => {
        res.status(202).send();
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}
