"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripService = void 0;
const common_1 = require("@nestjs/common");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let TripService = class TripService {
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
    async getUserAll(id) {
        return await prisma.trip.findMany({
            where: {
                userId: Number(id),
            },
            include: {
                activities: {
                    include: {
                        medias: true,
                    },
                }
            },
        });
    }
    async getById(id) {
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
                        medias: true,
                    },
                },
            }
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
    async removeActivity(tripId, activityId) {
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
};
TripService = __decorate([
    (0, common_1.Injectable)()
], TripService);
exports.TripService = TripService;
//# sourceMappingURL=trip.service.js.map