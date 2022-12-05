"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const const_1 = require("../const");
const utils_1 = require("../utils");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let ActivityService = class ActivityService {
    async getAll() {
        return await prisma.activity.findMany({
            include: {
                medias: true,
            },
        });
    }
    async getById(id) {
        return await prisma.activity.findUnique({
            where: { id: Number(id) },
            include: {
                medias: true,
            },
        });
    }
    async getByName(name) {
        return await prisma.activity.findMany({
            where: {
                name: {
                    search: name,
                },
            },
            include: {
                medias: true,
            },
        });
    }
    async getByCategory(categoryId) {
        return await prisma.activity.findMany({
            where: {
                place: {
                    placeTypeId: Number(categoryId),
                },
            },
            include: {
                medias: true,
            },
        });
    }
    async getMerchantActivities(id) {
        return await prisma.activity.findMany({
            where: {
                place: {
                    ownerId: Number(id),
                },
            },
        });
    }
    async getActivitySubscribers(id) {
        const trips = await prisma.activity
            .findUnique({
            where: { id: Number(id) },
        }).trips({
            include: {
                user: true,
            }
        });
        return trips.map((trip) => exclude(trip.user, "password"));
    }
    async update(id, req, body) {
        const activity = await prisma.activity.update({
            where: { id: Number(id) },
            data: body,
            include: {
                medias: true,
            },
        });
        if (req.files) {
            try {
                req.files.forEach(async (file) => {
                    let type = "";
                    switch (file.fieldname) {
                        case "images":
                            type = client_1.MediaType.IMAGE;
                            break;
                        case "documents":
                            type = client_1.MediaType.DOCUMENT;
                            break;
                    }
                    await prisma.media.create({
                        data: {
                            name: (0, utils_1.sanitizeFileName)(file.originalname),
                            url: "https://" +
                                const_1.CDN_STORAGE_ZONE +
                                ".b-cdn.net/" +
                                const_1.CDN_STORAGE_PATH +
                                "/" +
                                file.uploadName,
                            type: type,
                            activity: { connect: { id: Number(activity.id) } },
                        },
                    });
                });
            }
            catch (err) {
                throw err;
            }
        }
    }
    async delete(id) {
        return await prisma.activity.delete({
            where: { id: Number(id) },
        });
    }
};
ActivityService = __decorate([
    (0, common_1.Injectable)()
], ActivityService);
exports.ActivityService = ActivityService;
function exclude(user, ...keys) {
    for (let key of keys) {
        delete user[key];
    }
    return user;
}
//# sourceMappingURL=activity.service.js.map