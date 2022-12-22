import { Injectable } from "@nestjs/common";
import { MediaType } from "@prisma/client";
import { CDN_STORAGE_PATH, CDN_STORAGE_ZONE } from "src/const";
import { getPagination, sanitizeFileName } from "src/utils";
import { createReviewDto, getReviewsParamsDto, updateReviewDto } from "./review.dto";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const DEFAULT_LIMIT = 10;

@Injectable()
export class ReviewService {
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
        medias: {
          select: {
            id: true,
            url: true,
          },
        },
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
        medias: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
  }

  async create(req, body: createReviewDto) {
    try{
        const review = await prisma.review.create({
            data: {
              author:{
                  connect: {
                      id: req.user.id,
                  }
              },
              place: {
                connect: {
                  id: Number(body.placeId),
                },
              },
              rating: Number(body.rating),
              ...(body.description ? { description: body.description } : ""),
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
          return review;
    }
    catch(err){
        console.log(err)
        throw(err)
    }

  }

  async update(id: string, req:any, body: updateReviewDto) {
    const review = await prisma.review.update({
      where: { id: Number(id) },
      data: {
        ...(body.rating ? { rating: Number(body.rating) } : ""),
        ...(body.description ? { description: body.description } : ""),
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
  }

  async delete(id: string) {
    return await prisma.review.delete({
      where: { id: Number(id) },
    });
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
