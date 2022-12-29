import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { NotBlockedGuard } from "src/auth/notBlocked.guard";
import { Entity } from "src/auth/ownerOrAdmin.decorator";
import { OwnerOrAdminGuard } from "src/auth/ownerOrAdmin.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { CdnService } from "src/cdn/cdn.service";
import {
  createReviewDto,
  getReviewsParamsDto,
  updateReviewDto,
} from "./review.dto";
import { ReviewService } from "./review.service";

@Controller("reviews")
export class ReviewController {
  constructor(
    private reviewService: ReviewService,
    private cdnService: CdnService,
  ) {}
  @Get()
  async getAll(@Res() res, @Query() queries: getReviewsParamsDto) {
    this.reviewService
      .getAll(queries)
      .then((reviews) => {
        res.status(200).send(reviews);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Get(":id")
  async getById(@Param("id") id: string, @Res() res) {
    this.reviewService
      .getById(id)
      .then((review) => {
        res.status(200).send(review);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard,NotBlockedGuard)
  @Roles("ADMIN", "USER")
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() body: createReviewDto,
    @Request() req: any,
    @Res() res,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    files ? (req = await this.cdnService.upload(req,files)) : null;
    this.reviewService
      .create(req,body)
      .then((review) => {
        res.status(201).send(review);
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard,NotBlockedGuard)
  @Entity("review")
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param("id") id: string,
    @Body() body: updateReviewDto,
    @Request() req: any,
    @Res() res,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    files ? (req = await this.cdnService.upload(req, files)) : null;
    this.reviewService
      .update(id,req,body)
      .then((review) => {
        res.status(200).send(review);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard,NotBlockedGuard)
  @Entity("review")
  async delete(@Param("id") id: string, @Res() res) {
    this.reviewService
      .delete(id)
      .then((review) => {
        res.status(200).send(review);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}
