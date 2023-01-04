"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const event_service_1 = require("../event/event.service");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let TripService = class TripService {
    constructor(eventService) {
        this.eventService = eventService;
    }
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
    async getUserAll(id) {
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
    async getById(id) {
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
    async getByName(name) {
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
    async create(req, body) {
        const trip = await prisma.trip.create({
            data: {
                name: body.name,
                description: body.description,
                user: { connect: { id: req.user.id } },
            },
        });
        return trip;
    }
    async update(id, body) {
        return await prisma.trip.update({
            where: { id: Number(id) },
            data: body,
        });
    }
    async delete(id) {
        return await prisma.trip.delete({
            where: { id: Number(id) },
        });
    }
    async getActivities(tripId) {
        return await prisma.trip
            .findUnique({
            where: { id: Number(tripId) },
        })
            .activities();
    }
    async addActivity(tripId, activityId) {
        const trip = await prisma.trip.findUnique({
            where: { id: Number(tripId) },
            include: {
                activities: true,
            }
        });
        if (trip.activities.find(activity => activity.id === Number(activityId))) {
            throw new Error('Activity already in trip');
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
            type: client_1.EventType.ACTIVITY_SUBSCRIBED,
            activity: {
                connect: {
                    id: Number(activityId),
                },
            },
        });
        return updatedTrip;
    }
    async addPlace(tripId, placeId) {
        const trip = await prisma.trip.update({
            where: { id: Number(tripId) },
            data: {
                places: {
                    connect: { id: Number(placeId) },
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
                    id: trip.userId,
                },
            },
            type: client_1.EventType.PLACE_SUBSCRIBED,
            place: {
                connect: {
                    id: Number(placeId),
                },
            },
        });
        return trip;
    }
    async removeActivity(tripId, activityId) {
        const trip = await prisma.trip.findUnique({
            where: { id: Number(tripId) },
            include: {
                activities: true,
            }
        });
        if (!trip.activities.find(activity => activity.id === Number(activityId))) {
            throw new Error('Activity not in trip');
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
            type: client_1.EventType.ACTIVITY_UNSUBSCRIBED,
            activity: {
                connect: {
                    id: Number(activityId),
                },
            },
        });
        return updatedTrip;
    }
};
TripService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_service_1.EventService])
], TripService);
exports.TripService = TripService;
//# sourceMappingURL=trip.service.js.map