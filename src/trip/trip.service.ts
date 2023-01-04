import { Injectable } from "@nestjs/common";
import { EventType } from "@prisma/client";
import { EventService } from "src/event/event.service";
import { createTripDto, updateTripDto } from "./trip.dto";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

@Injectable()
export class TripService {
  constructor(private eventService: EventService) {}
  async getAll() {
    return await prisma.trip.findMany({
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
      },
    });
  }

  async getUserAll(id: string) {
    return await prisma.trip.findMany({
      where: {
        userId: Number(id),
      },
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
      },
    });
  }

  async getById(id: string) {
    return await prisma.trip.findUnique({
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
            address: true,
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

  async getActivities(tripId: string) {
    return await prisma.trip
      .findUnique({
        where: { id: Number(tripId) },
      })
      .activities();
  }

  async addActivity(tripId: string, activityId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: Number(tripId) },
      include: {
        activities: true,
      }
    })
    if(trip.activities.find(activity => activity.id === Number(activityId))){
      throw new Error('Activity already in trip')
    }
    const updatedTrip = await prisma.trip.update({
      where: { id: Number(tripId) },
      data: {
        activities: {
          connect: { id: Number(activityId) },
        },
      },
      include: {
        activities: true,
        places: true,
      },
    });
    this.eventService.create({
      user: {
        connect: {
          id: updatedTrip.userId,
        },
      },
      type: EventType.ACTIVITY_SUBSCRIBED,
      activity: {
        connect: {
          id: Number(activityId),
        },
      },
    });
    return updatedTrip;
  }

  async addPlace(tripId: string, placeId: string) {
    const trip = await prisma.trip.update({
      where: { id: Number(tripId) },
      data: {
        places: {
          connect: { id: Number(placeId) },
        },
      },
      include: {
        activities:true,
        places: true,
      },
    });
    this.eventService.create({
      user: {
        connect: {
          id: trip.userId,
        },
      },
      type: EventType.PLACE_SUBSCRIBED,
      place: {
        connect: {
          id: Number(placeId),
        },
      },
    });
    return trip;
  }

  async removeActivity(tripId: string, activityId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: Number(tripId) },
      include: {
        activities: true,
      }
    })
    if(!trip.activities.find(activity => activity.id === Number(activityId))){
      throw new Error('Activity not in trip')
    }
    const updatedTrip = await prisma.trip.update({
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
    this.eventService.create({
      user: {
        connect: {
          id: updatedTrip.userId,
        },
      },
      type: EventType.ACTIVITY_UNSUBSCRIBED,
      activity: {
        connect: {
          id: Number(activityId),
        },
      },
    });
    return updatedTrip;
    }
  }
