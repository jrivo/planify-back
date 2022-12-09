import { Injectable } from "@nestjs/common";
import { MediaType } from "@prisma/client";
import { CDN_STORAGE_PATH, CDN_STORAGE_ZONE } from "src/const";
import { sanitizeFileName } from "src/utils";
import { updateActivityDto } from "./activity.dto";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

@Injectable()
export class ActivityService {
  async getAll() {
    return await prisma.activity.findMany({
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

  async getByName(name: string) {
    return await prisma.activity.findMany({
      where: {
        name: {
          search: name,
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

  async getMerchantActivities(id: string) {
    return await prisma.activity.findMany({
      where: {
        place: {
          ownerId: Number(id),
        },
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
    });
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
      data: body,
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
  }

  async delete(id: string) {
    return await prisma.activity.delete({
      where: { id: Number(id) },
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
