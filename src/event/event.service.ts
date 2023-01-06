import { Injectable } from "@nestjs/common";
import { getPagination } from "src/utils";
import { getEventsParamsDto } from "./event.dto";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const DEFAULT_LIMIT = 10;

@Injectable()
export class EventService {
  async getAll(queries: getEventsParamsDto) {
    let pagination = getPagination(queries.page, queries.limit, DEFAULT_LIMIT);
    const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
    const whereConditions = {
      where: {
        ...(queries.merchant && {
          OR: [
            {
              place: {
                ownerId: Number(queries.merchant),
              },
            },
            {
              activity: {
                place: {
                  ownerId: Number(queries.merchant),
                },
              },
            },
          ],
        }),
      },
    };
    const totalPages = Math.ceil(
      (await prisma.event.count(whereConditions)) / limit
    );
    const events = await prisma.event.findMany({
      ...whereConditions,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: {
              select: {
                url: true,
              },
            },
          },
        },
        place: {
          select: {
            name: true,
          },
        },
        activity: {
          select: {
            name: true,
            place:{
                select:{
                    name: true,
                }
            }
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

    return {
      events,
      totalPages,
    };
  }

    async getById(id: string) {
        return await prisma.event.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePicture: {
                            select: {
                                url: true,
                            },
                        },
                    },
                },
                place: {
                    select: {
                        name: true,
                    },
                },
                activity: {
                    select: {
                        name: true,
                        place:{
                            select:{
                                name: true,
                            }
                        }
                    },
                },
            },
        });
    }

    async create(data: any) {
        return await prisma.event.create({
            data: {
                ...data,
            },
        });
    }
}
