import { Injectable } from "@nestjs/common";
import { MediaType } from "@prisma/client";
import { getActivitiesParamsDto } from "src/activity/activity.dto";
import { CDN_STORAGE_PATH, CDN_STORAGE_ZONE } from "src/const";
import {
  flattenObject,
  getPagination,
  removeObjectKeys,
  sanitizeFileName,
} from "src/utils";
import {
  createActivityDto,
  createPlaceDto,
  getPlaceActivitiesParamsDto,
  getPlacesParamsDto,
  updatePlaceDto,
} from "./place.dto";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const DEFAULT_LIMIT = 10;

@Injectable()
export class PlaceService {
  async getAll(queries: getPlacesParamsDto) {
    let pagination = getPagination(queries.page, queries.limit, DEFAULT_LIMIT);
    const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
    const whereConditions = {
      where: {
        ...(queries.category ? { placeTypeId: Number(queries.category) } : ""),
        ...(queries.merchant ? { ownerId: Number(queries.merchant) } : ""),
        ...(queries.search ? { name: { contains: queries.search } } : ""),
      },
    };
    const totalPages = Math.ceil(
      (await prisma.place.count({ ...whereConditions })) / limit
    );
    let places = await prisma.place.findMany({
      ...whereConditions,
      include: {
        address: true,
        medias: {
          select: {
            id: true,
            url: true,
          },
        },
        type: {
          select: {
            id: true,
            name: true,
          },
        },
        rating: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(pagination
        ? { take: pagination["take"], skip: pagination["skip"] }
        : ""),
    });
    // places = places.map((place) => {
    //   place = flattenObject(place);
    //   return removeObjectKeys(place, ["addressId", "placeTypeId"]);
    // });
    return { places, totalPages };
  }

  async getById(id: string) {
    return await prisma.place.findUnique({
      where: { id: Number(id) },
      include: {
        activities: {
          include: {
            medias: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
        medias: {
          select: {
            id: true,
            url: true,
          },
        },
        address: true,
        rating: true,
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
          googleAddressId: body.googleAddressId && body.googleAddressId,
          latitude: body.latitude && parseFloat(body.latitude),
          longitude: body.longitude && parseFloat(body.longitude),
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
              // case "mainImage":
              //   type = MediaType.MAIN_IMAGE;
              //   break;
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

  async update(id: string, req: any, body: updatePlaceDto) {
    //isAddress = true if any address field is not null
    try {
      const isAddress =
        body.street ||
        body.streetNumber ||
        body.city ||
        body.postalCode ||
        body.country ||
        body.region;
      const place = await prisma.place.update({
        where: { id: Number(id) },
        data: {
          name: body.name && body.name,
          description: body.description && body.description,
          website: body.website && body.website,
          phone: body.phone && body.phone,
          email: body.email && body.email,
          //add type:{ connect: { id: Number(body.placeTypeId) } } if placeTypeId is not null
          ...(body.placeTypeId && {
            type: { connect: { id: Number(body.placeTypeId) } },
          }),
        },
        include: {
          address: true,
        },
      });

      if (isAddress) {
        await prisma.address.update({
          where: { id: place.address.id },
          data: {
            street: body.street && body.street,
            streetNumber: body.streetNumber && body.streetNumber,
            city: body.city && body.city,
            postalCode: body.postalCode && body.postalCode,
            country: body.country && body.country,
            region: body.region && body.region,
            googleAddressId: body.googleAddressId && body.googleAddressId,
            latitude: body.latitude && parseFloat(body.latitude),
            longitude: body.longitude && parseFloat(body.longitude),
          },
        });
      }

      if (req.files && req.files.length > 0) {
        try {
          req.files.forEach(async (file) => {
            let type = "";
            switch (file.fieldname) {
              // case "mainImage":
              //   type = MediaType.MAIN_IMAGE;
              //   break;
              case "images":
                type = MediaType.IMAGE;
                break;
              case "documents":
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
      return await prisma.place.findUnique({
        where: { id: Number(id) },
        include: {
          address: true,
          medias: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      return error;
    }
    // return place;
  }

  async delete(id: string) {
    return await prisma.place.delete({
      where: { id: Number(id) },
    });
  }

  async getActivities(id: string, queries: getPlaceActivitiesParamsDto) {
    let pagination = getPagination(queries.page, queries.limit, DEFAULT_LIMIT);
    const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
    const totalPages = Math.ceil(
      (await prisma.activity.count({
        where: {
          placeId: Number(id),
          ...(queries.search ? { name: queries.search } : ""),
        },
      })) / limit
    );
    const activities = await prisma.activity.findMany({
      where: {
        placeId: Number(id),
        ...(queries.search ? { name: queries.search } : ""),
      },
      include: {
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

  async createActivity(id: string, req: any, body: createActivityDto) {
    const isAddress =
      body.street ||
      body.streetNumber ||
      body.city ||
      body.postalCode ||
      body.country ||
      body.region;
    let address = null;
    if (isAddress) {
      address = await prisma.address.create({
        data: {
          street: body.street,
          streetNumber: body.streetNumber,
          city: body.city,
          postalCode: body.postalCode,
          country: body.country,
          region: body.region,
          googleAddressId: body.googleAddressId && body.googleAddressId,
          latitude: body.latitude && parseFloat(body.latitude),
          longitude: body.longitude && parseFloat(body.longitude),
        },
      });
    }
    const activity = await prisma.activity.create({
      data: {
        name: body.name,
        description: body.description,
        place: { connect: { id: Number(id) } },
        price: body.price && Number(body.price),
        date: body.date && body.date,
        ...(isAddress && { address: { connect: { id: address.id } } }),
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
    if (!activity.address) {
      let activityPlace = await prisma.place.findUnique({
        where: { id: Number(id) },
      });
      await prisma.activity.update({
        where: { id: Number(activity.id) },
        data: {
          address: { connect: { id: Number(activityPlace.addressId) } },
        },
      });
    }

    if (req.files) {
      try {
        req.files.forEach(async (file) => {
          let type = "";
          switch (file.fieldname) {
            // case "mainImage":
            //   type = MediaType.MAIN_IMAGE;
            //   break;
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

  async getOwnerId(id: string) {
    return (
      await prisma.place.findUnique({
        where: { id: Number(id) },
        select: {
          owner: true,
        },
      })
    ).owner.id;
  }

  async refreshRating(placeId: string) {
    const reviews = await prisma.review.findMany({
      where: {
        placeId: Number(placeId),
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
    console.log("will update rating", updateBody)
    await prisma.rating.upsert({
      where: { placeId: Number(placeId) },
      update: updateBody,
      create: {
        place: { connect: { id: Number(placeId) } },
        ...updateBody,
      },
    }).then((res) => {
      console.log("updated rating", res)
    }).catch((err) => {
      console.log("error updating rating", err)
      });
  }
}
