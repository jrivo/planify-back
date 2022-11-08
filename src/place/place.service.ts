import { Injectable } from "@nestjs/common";
import { MediaType } from "@prisma/client";
import { CDN_STORAGE_PATH, CDN_STORAGE_ZONE } from "src/const";
import { sanitizeFileName } from "src/utils";
import { createActivityDto, createPlaceDto, updatePlaceDto } from "./place.dto";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

@Injectable()
export class PlaceService {
  async getAll() {
    return await prisma.place.findMany({
      include: {
        address: true,
      },
    });
  }

  async getById(id: string) {
    return await prisma.place.findUnique({
      where: { id: Number(id) },
      include: {
        activities: {
          include: {
            medias: true,
          },
        },
        medias: true,
      },
    });
  }

  async getByName(name: string) {
    return await prisma.place.findMany({
      where: {
        name: {
          search: name,
        },
      },
    });
  }

  async getByCategory(categoryId: string) {
    return await prisma.place.findMany({
      where: {
        placeTypeId: Number(categoryId),
      },
    });
  }

  async create(req, body: createPlaceDto) {
    try {
      const address = await prisma.address.create({
        data: {
          street: body.street,
          streetNumber: body.streetNumber,
          city: body.city,
          postalCode: body.postalCode,
          country: body.country,
          region: body.region && body.region,
        },
      });

      const place = await prisma.place.create({
        data: {
          name: body.name,
          description: body.description,
          address: { connect: { id: address.id } },
          website: body.website,
          phone: body.phone,
          email: body.email,
          type: { connect: { id: Number(body.placeTypeId) } },
          owner: { connect: { id: Number(req.user.id) } },
        },
        include: {
          address: true,
          medias: true,
        },
      });

      if (req.files) {
        try {
          req.files.forEach(async (file) => {
            let type = "";
            switch (file.fieldname) {
              case "mainImage":
                type = MediaType.MAIN_IMAGE;
                break;
              case "image":
                type = MediaType.IMAGE;
                break;
              case "document":
                type = MediaType.DOCUMENT;
                break;
            }
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
                place: { connect: { id: Number(place.id) } },
              },
            });
          });
        } catch (err) {
          throw err;
        }
      }
      return place;
    } catch (err) {
      // console.log(err)
      throw err;
    }
  }

  async update(id: string, req:any,body: updatePlaceDto) {
    const place = await prisma.place.update({
      where: { id: Number(id) },
      data: body,
      include: {
        address:true,
        medias: true,
      },
    });

    if (req.files) {
      try {
        req.files.forEach(async (file) => {
          let type = "";
          switch (file.fieldname) {
            case "mainImage":
              type = MediaType.MAIN_IMAGE;
              break;
            case "image":
              type = MediaType.IMAGE;
              break;
            case "document":
              type = MediaType.DOCUMENT;
              break;
          }
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
              place: { connect: { id: Number(place.id) } },
            },
          });
        });
      } catch (err) {
        throw err;
      }
    }
    return place;
  }

  async delete(id: string) {
    return await prisma.place.delete({
      where: { id: Number(id) },
    });
  }

  async getActivities(id: string) {
    return await prisma.activity.findMany({
      where: {
        placeId: Number(id),
      },
    });
  }

  async createActivity(id: string, req: any, body: createActivityDto) {
    console.log(body);
    const activity = await prisma.activity.create({
      data: {
        name: body.name,
        description: body.description,
        place: { connect: { id: Number(id) } },
        price: body.price && body.price,
        date: body.date && body.date,
      },
      include: {
        medias: true,
      },
    });

    if (req.files) {
      try {
        req.files.forEach(async (file) => {
          let type = "";
          switch (file.fieldname) {
            case "mainImage":
              type = MediaType.MAIN_IMAGE;
              break;
            case "image":
              type = MediaType.IMAGE;
              break;
            case "document":
              type = MediaType.DOCUMENT;
              break;
          }
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
              activity: { connect: { id: activity.id } },
            },
          });
        });
      } catch (err) {
        throw err;
      }
    }
    return activity;
  }
}
