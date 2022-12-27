import { Injectable } from "@nestjs/common";
import { MediaType } from "@prisma/client";
import { CDN_STORAGE_PATH, CDN_STORAGE_ZONE } from "src/const";
import { getPagination, redeserialize, removeObjectKeys, sanitizeFileName } from "src/utils";
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
        ...(queries.category
          ? {
              place: {
                placeTypeId: Number(queries.category),
              },
            }
          : ""),
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
          },
        },
        rating: true
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(pagination
        ? { take: pagination["take"], skip: pagination["skip"] }
        : ""),
    });
    activities = activities.map((activity) => {
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
    return { activities, totalPages };
  }

  async getById(id: string) {
    const activity = await prisma.activity.findUnique({
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
        rating: true
      },
    });
    return activity
      ? redeserialize(
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
        )
      : null;
  }

  async getSubscribedActivities(userId: string) {
    let activities = await prisma.activity.findMany({
      where: {
        trips: {
          some: {
            userId: Number(userId),
          },
        },
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
        trips: true
      },
    });
    activities = activities.map((activity) => {
      activity.trips = activity.trips.find(trip => trip.userId === Number(userId))
      return redeserialize(
        activity,
        [
          {
            data: activity.trips.id,
            newKey: "tripId",
          },
        ],
        ["trips"]
      )
    })
    return activities;
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
    let trips = await prisma.activity
      .findUnique({
        where: { id: Number(id) },
      })
      .trips({
        select: {
          id: true,
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
    if (!trips) return null;
    let subscribers = trips.map((trip) => {
      return {
        ...exclude(trip.user, "password"),
        tripId: trip.id,
      };
    });
    return subscribers;
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

  async refreshRating(activityId: string) {
    const reviews = await prisma.review.findMany({
      where: {
        activityId: Number(activityId),
      },
      select: {
        rating: true,
      },
    });
    const rating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, average: 0 };
    const ratedReviews = reviews.filter((review) => review.rating != null);
    ratedReviews.map((review) => {
      rating[review.rating] += 1;
    });
    rating["average"] =
      (rating[1] +
        rating[2] * 2 +
        rating[3] * 3 +
        rating[4] * 4 +
        rating[5] * 5) /
      ratedReviews.length;
    const updateBody = {
      one: rating[1],
      two: rating[2],
      three: rating[3],
      four: rating[4],
      five: rating[5],
      average: rating["average"],
    };
    console.log(updateBody)
    await prisma.rating.upsert({
      where: { activityId: Number(activityId) },
      update: updateBody,
      create: {
        activity: { connect: { id: Number(activityId) } },
        ...updateBody,
      },
    }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
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
