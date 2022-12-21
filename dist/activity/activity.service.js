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
const DEFAULT_LIMIT = 10;
let ActivityService = class ActivityService {
    async getAll(queries) {
        let pagination = (0, utils_1.getPagination)(queries.page, queries.limit, DEFAULT_LIMIT);
        const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
        const totalPages = Math.ceil((await prisma.place.count()) / limit);
        let activities = await prisma.activity.findMany(Object.assign({ where: Object.assign(Object.assign(Object.assign({}, (queries.category ? { place: {
                    placeTypeId: Number(queries.category)
                } } : "")), (queries.merchant
                ? {
                    place: {
                        ownerId: Number(queries.merchant),
                    },
                }
                : "")), (queries.search
                ? {
                    name: {
                        contains: queries.search,
                    },
                }
                : "")), include: {
                medias: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
                place: {
                    select: {
                        owner: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            }, orderBy: {
                createdAt: "desc",
            } }, (pagination
            ? { take: pagination["take"], skip: pagination["skip"] }
            : "")));
        return { activities, totalPages };
    }
    async getById(id) {
        return await prisma.activity.findUnique({
            where: { id: Number(id) },
            include: {
                medias: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
                address: true,
                place: {
                    select: {
                        owner: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        type: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getSubscribedActivities(userId) {
        return await prisma.activity.findMany({
            where: {
                trips: {
                    some: {
                        userId: Number(userId),
                    }
                }
            },
            include: {
                medias: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
                place: {
                    select: {
                        owner: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async searchActivities(queries) {
        let pagination = (0, utils_1.getPagination)(queries.page, queries.limit, DEFAULT_LIMIT);
        const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
        const totalPages = Math.ceil((await prisma.activity.count({
            where: Object.assign({ name: {
                    search: queries.search,
                } }, (queries.category
                ? {
                    place: {
                        placeTypeId: Number(queries.category),
                    },
                }
                : "")),
        })) / limit);
        const activities = await prisma.activity.findMany(Object.assign({ where: Object.assign({ name: {
                    search: queries.search,
                } }, (queries.category
                ? {
                    place: {
                        placeTypeId: Number(queries.category),
                    },
                }
                : "")), include: {
                medias: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
            }, orderBy: {
                createdAt: "desc",
            } }, (pagination
            ? { take: pagination["take"], skip: pagination["skip"] }
            : "")));
        return { activities, totalPages };
    }
    async getByCategory(categoryId) {
        return await prisma.activity.findMany({
            where: {
                place: {
                    placeTypeId: Number(categoryId),
                },
            },
            include: {
                medias: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
            },
        });
    }
    async getMerchantActivities(queries) {
        let pagination = (0, utils_1.getPagination)(queries.page, queries.limit, DEFAULT_LIMIT);
        const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
        const totalPages = Math.ceil((await prisma.activity.count({
            where: Object.assign({ place: {
                    ownerId: Number(queries.merchant),
                } }, (queries.category
                ? {
                    place: {
                        placeTypeId: Number(queries.category),
                    },
                }
                : "")),
        })) / limit);
        const activities = await prisma.activity.findMany(Object.assign({ where: Object.assign({ place: {
                    ownerId: Number(queries.merchant),
                } }, (queries.category
                ? {
                    place: {
                        placeTypeId: Number(queries.category),
                    },
                }
                : "")), include: {
                medias: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
                address: true,
            }, orderBy: {
                createdAt: "desc",
            } }, (pagination
            ? { take: pagination["take"], skip: pagination["skip"] }
            : "")));
        return { activities, totalPages };
    }
    async getActivitySubscribers(id) {
        const trips = await prisma.activity
            .findUnique({
            where: { id: Number(id) },
        })
            .trips({
            include: {
                user: {
                    include: {
                        profilePicture: {
                            select: {
                                id: true,
                                url: true,
                            },
                        },
                    },
                },
            },
        });
        return trips.map((trip) => exclude(trip.user, "password"));
    }
    async update(id, req, body) {
        const activity = await prisma.activity.update({
            where: { id: Number(id) },
            data: {
                name: body.name && body.name,
                description: body.description && body.description,
                price: body.price && Number(body.price),
                date: body.date && body.date,
            },
            include: {
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
        return activity;
    }
    async delete(id) {
        return await prisma.activity.delete({
            where: { id: Number(id) },
        });
    }
    async getOwnerId(id) {
        return (await prisma.activity.findUnique({
            where: { id: Number(id) },
            select: {
                place: {
                    select: {
                        ownerId: true,
                    },
                },
            },
        })).place.ownerId;
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