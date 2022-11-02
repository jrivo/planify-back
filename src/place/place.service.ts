import { Injectable } from "@nestjs/common";
import { MediaType, Place } from "@prisma/client";
import { CDN_STORAGE_PATH, CDN_STORAGE_ZONE } from "src/const";
import { sanitizeFileName } from "src/utils";
import { createPlaceDto, updatePlaceDto } from "./place.dto";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

@Injectable()
export class PlaceService {
  async getAll() {
    return await prisma.place.findMany();
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
          street: body.address.street,
          streetNumber: body.address.streetNumber,
          city: body.address.city,
          postalCode: body.address.postalCode,
          country: body.address.country,
          region: body.address.region && body.address.region,
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
          type: { connect: { id: body.placeTypeId } },
          owner: { connect: { id: req.user.id } },
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
                place: { connect: { id: place.id } },
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

  async update(id: string, body: updatePlaceDto) {
      return await prisma.place.update({
        where: { id: Number(id) },
        data: {
          name: body.name,
          description: body.description,
          address: body.address,
          website: body.website,
          phone: body.phone,
          email: body.email,
          placeTypeId: body.placeTypeId,
        },
      });
  }

  delete(id: string) {
    return prisma.place.delete({
      where: { id: Number(id) },
    });
  }
}
