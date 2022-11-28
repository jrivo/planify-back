import { Injectable } from "@nestjs/common";
import { createTripDto, updateTripDto } from "./trip.dto";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

@Injectable()
export class TripService {
  async getAll() {
    return await prisma.trip.findMany({
      include: {
        activities: {
          include: {
            medias: true,
          },
        },
      },
    });
  }

  async getUserAll(id: string) {
    return await prisma.trip.findMany({
      where: {
        userId: Number(id),
      },
      include: {
        activities: true,
      },
    });
  }

  async getById(id: string) {
    return await prisma.trip.findUnique({
      where: { id: Number(id) },
      include: {
        activities: {
          include: {
            medias: true,
          },
        },
      },
    });
  }

  async getByName(name: string) {
    return await prisma.trip.findMany({
      where: {
        name: {
          search: name,
        },
      },
    });
  }

  async create(req, body: createTripDto) {
    const trip = await prisma.trip.create({
      data: {
        name: body.name,
        description: body.description,
        user: { connect: { id: req.user.id } },
      },
    });

    return trip;
  }

  async update(id: string, body: updateTripDto) {
    return await prisma.trip.update({
      where: { id: Number(id) },
      data: body,
    });
  }

  async delete(id: string) {
    return await prisma.trip.delete({
      where: { id: Number(id) },
    });
  }

  async addActivity(tripId: string, activityId: string) {
    return await prisma.trip.update({
      where: { id: Number(tripId) },
      data: {
        activities: {
          connect: { id: Number(activityId) },
        },
      },
      include: {
        activities: true,
      },
    });
  }

  async removeActivity(tripId: string, activityId: string) {
    return await prisma.trip.update({
      where: { id: Number(tripId) },
      data: {
        activities: {
          disconnect: { id: Number(activityId) },
        },
      },
      include: {
        activities: true,
      },
    });
  }
}
