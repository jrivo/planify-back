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
                medias: {
                    select: {
                        id: true,
                        url: true
                    }
                },
                type: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async getMerchantPlaces(id) {
        return await prisma.place.findMany({
            where: {
                ownerId: Number(id),
            },
            include: {
                address: true,
                medias: {
                    select: {
                        id: true,
                        url: true
                    }
                },
            },
        });
    }
    async getById(id) {
        return await prisma.place.findUnique({
            where: { id: Number(id) },
            include: {
                activities: {
                    include: {
                        medias: {
                            select: {
                                id: true,
                                url: true
                            }
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
    }
    async getByCategory(categoryId) {
        return await prisma.place.findMany({
            where: {
                placeTypeId: Number(categoryId),
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
                    medias: {
                        select: {
                            id: true,
                            url: true
                        }
                    },
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
        try {
            const isAddress = body.street ||
                body.streetNumber ||
                body.city ||
                body.postalCode ||
                body.country ||
                body.region;
            const place = await prisma.place.update({
                where: { id: Number(id) },
                data: Object.assign({ name: body.name && body.name, description: body.description && body.description, website: body.website && body.website, phone: body.phone && body.phone, email: body.email && body.email }, (body.placeTypeId && {
                    type: { connect: { id: Number(body.placeTypeId) } },
                })),
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
                    },
                });
            }
            console.log("FILES", req.files);
            if (req.files && req.files.length > 0) {
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
                                place: { connect: { id: Number(place.id) } },
                            },
                        });
                    });
                }
                catch (err) {
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
                            url: true
                        }
                    },
                },
            });
        }
        catch (error) {
            console.log(error);
            return error;
        }
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
            include: {
                address: true,
            },
        });
    }
    async createActivity(id, req, body) {
        const isAddress = body.street ||
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
                },
            });
        }
        const activity = await prisma.activity.create({
            data: Object.assign({ name: body.name, description: body.description, place: { connect: { id: Number(id) } }, price: body.price && Number(body.price), date: body.date && new Date(body.date) }, (isAddress && { address: { connect: { id: address.id } } })),
            include: {
                medias: {
                    select: {
                        id: true,
                        url: true
                    }
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