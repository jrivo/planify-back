"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const const_1 = require("../const");
const utils_1 = require("../utils");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let PlaceService = class PlaceService {
    async getAll() {
        return await prisma.place.findMany({
            include: {
                address: true,
            },
        });
    }
    async getById(id) {
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
    async getByName(name) {
        return await prisma.place.findMany({
            where: {
                name: {
                    search: name,
                },
            },
        });
    }
    async getByCategory(categoryId) {
        return await prisma.place.findMany({
            where: {
                placeTypeId: Number(categoryId),
            },
        });
    }
    async create(req, body) {
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
                                type = client_1.MediaType.MAIN_IMAGE;
                                break;
                            case "image":
                                type = client_1.MediaType.IMAGE;
                                break;
                            case "document":
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
                                place: { connect: { id: Number(place.id) } },
                            },
                        });
                    });
                }
                catch (err) {
                    throw err;
                }
            }
            return place;
        }
        catch (err) {
            throw err;
        }
    }
    async update(id, req, body) {
        const place = await prisma.place.update({
            where: { id: Number(id) },
            data: body,
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
                            type = client_1.MediaType.MAIN_IMAGE;
                            break;
                        case "image":
                            type = client_1.MediaType.IMAGE;
                            break;
                        case "document":
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
                            place: { connect: { id: Number(place.id) } },
                        },
                    });
                });
            }
            catch (err) {
                throw err;
            }
        }
        return place;
    }
    async delete(id) {
        return await prisma.place.delete({
            where: { id: Number(id) },
        });
    }
    async getActivities(id) {
        return await prisma.activity.findMany({
            where: {
                placeId: Number(id),
            },
        });
    }
    async createActivity(id, req, body) {
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
                            type = client_1.MediaType.MAIN_IMAGE;
                            break;
                        case "image":
                            type = client_1.MediaType.IMAGE;
                            break;
                        case "document":
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
                            activity: { connect: { id: activity.id } },
                        },
                    });
                });
            }
            catch (err) {
                throw err;
            }
        }
        return activity;
    }
};
PlaceService = __decorate([
    (0, common_1.Injectable)()
], PlaceService);
exports.PlaceService = PlaceService;
//# sourceMappingURL=place.service.js.map