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
import { prismaErrorHandler } from "src/prisma/errorsHandler";
import { ActivityService } from "./activity.service";
import { getActivitiesParamsDto, updateActivityDto } from "./activity.dto";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { CdnService } from "src/cdn/cdn.service";
import { redeserialize } from "src/utils";
import { OwnerOrAdminGuard } from "src/auth/ownerOrAdmin.guard";
import { Entity } from "src/auth/ownerOrAdmin.decorator";

@Controller("activities")
export class ActivityController {
  constructor(
    private activityService: ActivityService,
    private cdnService: CdnService
  ) {}

  @Get()
  async getAll(@Res() res, @Query() queries: getActivitiesParamsDto) {
      this.activityService
        .getAll(queries)
        .then((activities) => {
          activities.activities = activities.activities.map((activity) => {
            return redeserialize(
              activity,
              [
                {
                  data: activity.place.owner.firstName,
                  newKey: "ownerFirstName",
                },
                {
                  data: activity.place.owner.lastName,
                  newKey: "ownerLastName",
                },
                {
                  data: activity.place.owner.id,
                  newKey: "ownerId",
                },
              ],
              ["place"]
            );
          });
          res.status(200).send(activities);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    
  }

  @Get("subscribed")
  @UseGuards(JwtAuthGuard)
  async getSubscribedActivities(@Request() req: any, @Res() res) {
    this.activityService
      .getSubscribedActivities(req.user.id)
      .then((activities) => {
        res.status(200).send(activities);
      })
      .catch((err) => {
        res.status(500).send(prismaErrorHandler(err));
      });
  }

  @Get(":id")
  async getById(@Param("id") id: string, @Res() res) {
    this.activityService
      .getById(id)
      .then((activity) => {
        activity = redeserialize(
          activity,
          [
            {
              data: activity.place.owner.firstName,
              newKey: "ownerFirstName",
            },
            {
              data: activity.place.owner.lastName,
              newKey: "ownerLastName",
            },
            {
              data: activity.place.owner.id,
              newKey: "ownerId",
            },
          ],
          ["place"]
        );
        activity
          ? res.status(200).send(activity)
          : res.status(404).send("Activity not found");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Get(":id/subscribers")
  @UseGuards(JwtAuthGuard)
  async getActivitySubscribers(@Param("id") id: string, @Res() res) {
    this.activityService
      .getActivitySubscribers(id)
      .then((subscribers) => {
        res.status(200).send(subscribers);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Put(":id")
  @UseInterceptors(AnyFilesInterceptor())
  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
  @Entity("activity")
  //add owner or admin guard
  async update(
    @Param("id") id: string,
    @Body() body: updateActivityDto,
    @Request() req: any,
    @Res() res,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    files ? (req = await this.cdnService.upload(req, files)) : null;
    this.activityService
      .update(id, req, body)
      .then((activity) => {
        res.status(202).send(activity);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
  @Entity("activity")
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
