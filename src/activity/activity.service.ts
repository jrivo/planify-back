import { Injectable } from "@nestjs/common";
import { MediaType } from "@prisma/client";
import { CDN_STORAGE_PATH, CDN_STORAGE_ZONE } from "src/const";
import { getPagination, redeserialize, sanitizeFileName } from "src/utils";
import { getActivitiesParamsDto, updateActivityDto } from "./activity.dto";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const DEFAULT_LIMIT = 10;

@Injectable()
export class ActivityService {
  async getAll(queries: getActivitiesParamsDto) {
    let pagination = getPagination(queries.page, queries.limit, DEFAULT_LIMIT);
    const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
    const totalPages = Math.ceil((await prisma.place.count()) / limit);
    let activities = await prisma.activity.findMany({
      where: {
        ...(queries.category ? { place:{
          placeTypeId: Number(queries.category)
        }} : ""),
        ...(queries.merchant
          ? {
              place: {
                ownerId: Number(queries.merchant),
              },
            }
          : ""),
        ...(queries.search
          ? {
              name: {
                contains: queries.search,
              },
            }
          : ""),
      },
      include: {
        medias: {
          select: {
            id: true,
            url: true,
          },
        },
        place: {
          select: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
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
    return { activities, totalPages };
  }

  async getById(id: string) {
    return await prisma.activity.findUnique({
      where: { id: Number(id) },
      include: {
        medias: {
          select: {
            id: true,
            url: true,
          },
        },
        address: true,
        place: {
          select: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            type: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async getSubscribedActivities(userId: string) {
    return await prisma.activity.findMany({
      where: {
          trips: {
            some: {
              userId: Number(userId),
            }
          }
      },
      include: {
        medias: {
          select: {
            id: true,
            url: true,
          },
        },
        place: {
          select: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }
  async searchActivities(queries: getActivitiesParamsDto) {
    let pagination = getPagination(queries.page, queries.limit, DEFAULT_LIMIT);
    const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
    const totalPages = Math.ceil(
      (await prisma.activity.count({
        where: {
          name: {
            search: queries.search,
          },
          ...(queries.category
            ? {
                place: {
                  placeTypeId: Number(queries.category),
                },
              }
            : ""),
        },
      })) / limit
    );
    const activities = await prisma.activity.findMany({
      where: {
        name: {
          search: queries.search,
        },
        ...(queries.category
          ? {
              place: {
                placeTypeId: Number(queries.category),
              },
            }
          : ""),
      },
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
    return { activities, totalPages };
  }

  async getByCategory(categoryId: string) {
    return await prisma.activity.findMany({
      where: {
        place: {
          placeTypeId: Number(categoryId),
        },
      },
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

  async getMerchantActivities(queries: getActivitiesParamsDto) {
    let pagination = getPagination(queries.page, queries.limit, DEFAULT_LIMIT);
    const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
    const totalPages = Math.ceil(
      (await prisma.activity.count({
        where: {
          place: {
            ownerId: Number(queries.merchant),
          },
          ...(queries.category
            ? {
                place: {
                  placeTypeId: Number(queries.category),
                },
              }
            : ""),
        },
      })) / limit
    );
    const activities = await prisma.activity.findMany({
      where: {
        place: {
          ownerId: Number(queries.merchant),
        },
        ...(queries.category
          ? {
              place: {
                placeTypeId: Number(queries.category),
              },
            }
          : ""),
      },
      include: {
        medias: {
          select: {
            id: true,
            url: true,
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(pagination
        ? { take: pagination["take"], skip: pagination["skip"] }
        : ""),
    });
    return { activities, totalPages };
  }

  async getActivitySubscribers(id: string) {
    const trips = await prisma.activity
      .findUnique({
        where: { id: Number(id) },
      })
      .trips({
        include: {
          user: {
            include: {
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
    return trips.map((trip) => exclude(trip.user, "password"));
  }

  async update(id: string, req: any, body: updateActivityDto) {
    const activity = await prisma.activity.update({
      where: { id: Number(id) },
      data: {
        name: body.name && body.name,
        description: body.description && body.description,
        price: body.price && Number(body.price),
        date: body.date && body.date,
      },
      include: {
        medias: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    if (req.files) {
      try {
        req.files.forEach(async (file) => {
          let type = "";
          switch (file.fieldname) {
            case "images":
              type = MediaType.IMAGE;
              break;
            case "documents":
              type = MediaType.DOCUMENT;
              break;
          }
          //TODO: add mainImage ID to place
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
              type: type,
              activity: { connect: { id: Number(activity.id) } },
            },
          });
        });
      } catch (err) {
        throw err;
      }
    }
    return activity;
  }

  async delete(id: string) {
    return await prisma.activity.delete({
      where: { id: Number(id) },
    });
  }
  async getOwnerId(id: string) {
    return (
      await prisma.activity.findUnique({
        where: { id: Number(id) },
        select: {
          place: {
            select: {
              ownerId: true,
            },
          },
        },
      })
    ).place.ownerId;
  }
}

function exclude<User, Key extends keyof User>(
  user: User,
  ...keys: Key[]
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
