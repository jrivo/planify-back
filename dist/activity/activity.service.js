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
        try {
            let pagination = (0, utils_1.getPagination)(queries.page, queries.limit, DEFAULT_LIMIT);
            const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
            const whereConditions = {
                where: Object.assign(Object.assign(Object.assign({}, (queries.category
                    ? {
                        place: {
                            placeTypeId: Number(queries.category),
                        },
                    }
                    : "")), (queries.merchant
                    ? {
                        place: {
                            ownerId: Number(queries.merchant),
                        },
                    }
                    : "")), (queries.search
                    ? {
                        OR: [
                            {
                                name: { contains: queries.search, mode: "insensitive" },
                            },
                            {
                                description: {
                                    contains: queries.search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                address: {
                                    city: { contains: queries.search, mode: "insensitive" },
                                },
                            },
                            {
                                place: {
                                    name: { contains: queries.search, mode: "insensitive" },
                                },
                            },
                            {
                                place: {
                                    type: {
                                        name: { contains: queries.search, mode: "insensitive" },
                                    },
                                },
                            },
                        ],
                    }
                    : "")),
            };
            const totalPages = Math.ceil((await prisma.activity.count(Object.assign({}, whereConditions))) / limit);
            let activities = await prisma.activity.findMany(Object.assign(Object.assign(Object.assign({}, whereConditions), { include: {
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
                        },
                    },
                    rating: true,
                }, orderBy: {
                    createdAt: "desc",
                } }), (pagination
                ? { take: pagination["take"], skip: pagination["skip"] }
                : "")));
            activities = activities.map((activity) => {
                return (0, utils_1.redeserialize)(activity, [
                    {
                        data: activity.place.owner.firstName,
                        newKey: "ownerFirstName",
                    },
                    {
                        data: activity.place.owner.lastName,
                        newKey: "ownerLastName",
                    },
                    {
                        data: activity.place.owner.id,
                        newKey: "ownerId",
                    },
                ], ["place"]);
            });
            return { activities, totalPages };
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async getById(id) {
        const activity = await prisma.activity.findUnique({
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
                rating: true,
            },
        });
        console.log(activity);
        return activity
            ? (0, utils_1.redeserialize)(activity, [
                {
                    data: activity.place.owner.firstName,
                    newKey: "ownerFirstName",
                },
                {
                    data: activity.place.owner.lastName,
                    newKey: "ownerLastName",
                },
                {
                    data: activity.place.owner.id,
                    newKey: "ownerId",
                },
            ], ["place"])
            : null;
    }
    async getSubscribedActivities(userId) {
        let activities = await prisma.activity.findMany({
            where: {
                trips: {
                    some: {
                        userId: Number(userId),
                    },
                },
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
                trips: true,
            },
        });
        activities = activities.map((activity) => {
            activity.trips = activity.trips.find((trip) => trip.userId === Number(userId));
            return (0, utils_1.redeserialize)(activity, [
                {
                    data: activity.trips.id,
                    newKey: "tripId",
                },
            ], ["trips"]);
        });
        return activities;
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
        let trips = await prisma.activity
            .findUnique({
            where: { id: Number(id) },
        })
            .trips({
            select: {
                id: true,
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
        if (!trips)
            return null;
        let subscribers = trips.map((trip) => {
            return Object.assign(Object.assign({}, exclude(trip.user, "password")), { tripId: trip.id });
        });
        return subscribers;
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
    async refreshRating(activityId) {
        const reviews = await prisma.review.findMany({
            where: {
                activityId: Number(activityId),
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
        console.log(updateBody);
        await prisma.rating
            .upsert({
            where: { activityId: Number(activityId) },
            update: updateBody,
            create: Object.assign({ activity: { connect: { id: Number(activityId) } } }, updateBody),
        })
            .then((res) => {
            console.log(res);
        })
            .catch((err) => {
            console.log(err);
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