import { Injectable } from "@nestjs/common";
import { MediaType } from "@prisma/client";
import { ActivityService } from "src/activity/activity.service";
import { CDN_STORAGE_PATH, CDN_STORAGE_ZONE } from "src/const";
import { PlaceService } from "src/place/place.service";
import { getPagination, sanitizeFileName } from "src/utils";
import {
  createReviewDto,
  getReviewsParamsDto,
  updateReviewDto,
} from "./review.dto";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const DEFAULT_LIMIT = 10;

@Injectable()
export class ReviewService {
  constructor(
    private placeService: PlaceService,
    private activityService: ActivityService
  ) {}
  async getAll(queries: getReviewsParamsDto) {
    let pagination = getPagination(queries.page, queries.limit, DEFAULT_LIMIT);
    const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
    const whereConditions = {
      where: {
        ...(queries.author ? { userId: Number(queries.author) } : ""),
        ...(queries.place ? { placeId: Number(queries.place) } : ""),
        ...(queries.status ? { status: queries.status } : ""),
        ...(queries.search
          ? { description: { contains: queries.search } }
          : ""),
      },
    };
    const totalPages = Math.ceil(
      (await prisma.review.count({ ...whereConditions })) / limit
    );
    let reviews = await prisma.review.findMany({
      ...whereConditions,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
        medias:{
          select:{
            id:true,
            url:true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(pagination
        ? { take: pagination["take"], skip: pagination["skip"] }
        : ""),
    });
    return { reviews, totalPages };
  }

  async getById(id: string) {
    return await prisma.review.findUnique({
      where: { id: Number(id) },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
        medias:{
          select:{
            id:true,
            url:true,
          }
        }
      },
    });
  }

  async create(req, body: createReviewDto) {
    const isPlace = body.placeId ? true : false;
    const isActivity = body.activityId ? true : false;
    const isAlreadyReviewed = await prisma.review.findFirst({
      where: {
        authorId: req.user.id,
        ...(isPlace
          ? {
              placeId: Number(body.placeId),
            }
          : ""),
        ...(isActivity
          ? {
              activityId: Number(body.activityId),
            }
          : ""),
      },
    });
    if (isAlreadyReviewed) {
      throw new Error("You have already reviewed this place or activity");
    }
    if ((isPlace && isActivity) || (!isPlace && !isActivity)) {
      throw new Error("You have to define either place or activity to review");
    }
    try {
      const review = await prisma.review.create({
        data: {
          author: {
            connect: {
              id: req.user.id,
            },
          },
          ...(isPlace
            ? {
                place: {
                  connect: {
                    id: Number(body.placeId),
                  },
                },
              }
            : ""),
          ...(isActivity
            ? {
                activity: {
                  connect: {
                    id: Number(body.activityId),
                  },
                },
              }
            : ""),

          rating: Number(body.rating),
          ...(body.description ? { description: body.description } : ""),
        },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              profilePicture: {
                select: {
                  id: true,
                  url: true,
                },
              },
            },
          },
        },
      });
      if (req.files) {
        console.log(req.files)
        req.files.forEach(async (file) => {
          await prisma.media.create({
            data: {
              name: sanitizeFileName(file.originalname),
              url:
                "https://" +
                CDN_STORAGE_ZONE +
                ".b-cdn.net/" +
                CDN_STORAGE_PATH +
                "/" +
                file.uploadName,
              type: MediaType.IMAGE,
              review: {
                connect: {
                  id: review.id,
                },
              },
            },
          });
        });
      }
      isPlace
        ? this.placeService.refreshRating(body.placeId)
        : this.activityService.refreshRating(body.activityId);
      return review;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async update(id: string, req: any, body: updateReviewDto) {
    const review = await prisma.review.update({
      where: { id: Number(id) },
      data: {
        ...(body.rating ? { rating: Number(body.rating) } : ""),
        ...(body.description ? { description: body.description } : ""),
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
      },
    });

    if (req.files) {
      req.files.foreach(async (file) => {
        await prisma.media.create({
          data: {
            name: sanitizeFileName(file.originalname),
            url:
              "https://" +
              CDN_STORAGE_ZONE +
              ".b-cdn.net/" +
              CDN_STORAGE_PATH +
              "/" +
              file.uploadName,
            type: MediaType.IMAGE,
            review: {
              connect: {
                id: review.id,
              },
            },
          },
        });
      });
    }
    review.placeId ? this.placeService.refreshRating(review.placeId) : "";
    review.activityId
      ? this.activityService.refreshRating(review.activityId)
      : "";
    return review;
  }

  async delete(id: string) {
    const review = await prisma.review.delete({
      where: { id: Number(id) },
    });
    review.placeId ? this.placeService.refreshRating(review.placeId) : "";
    review.activityId
      ? this.activityService.refreshRating(review.activityId)
      : "";
    return review;
  }

  async getOwnerId(id: string) {
    return (
      await prisma.review.findUnique({
        where: { id: Number(id) },
        select: {
          userId: true,
        },
      })
    ).userId;
  }
}
