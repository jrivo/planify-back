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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const activity_service_1 = require("../activity/activity.service");
const const_1 = require("../const");
const place_service_1 = require("../place/place.service");
const utils_1 = require("../utils");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const DEFAULT_LIMIT = 10;
let ReviewService = class ReviewService {
    constructor(placeService, activityService) {
        this.placeService = placeService;
        this.activityService = activityService;
    }
    async getAll(queries) {
        let pagination = (0, utils_1.getPagination)(queries.page, queries.limit, DEFAULT_LIMIT);
        const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
        const whereConditions = {
            where: Object.assign(Object.assign(Object.assign(Object.assign({}, (queries.author ? { userId: Number(queries.author) } : "")), (queries.place ? { placeId: Number(queries.place) } : "")), (queries.status ? { status: queries.status } : "")), (queries.search
                ? { description: { contains: queries.search } }
                : "")),
        };
        const totalPages = Math.ceil((await prisma.review.count(Object.assign({}, whereConditions))) / limit);
        let reviews = await prisma.review.findMany(Object.assign(Object.assign(Object.assign({}, whereConditions), { include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePicture: {
                            select: {
                                id: true,
                                url: true,
                            },
                        },
                    },
                },
                medias: {
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }, orderBy: {
                createdAt: "desc",
            } }), (pagination
            ? { take: pagination["take"], skip: pagination["skip"] }
            : "")));
        return { reviews, totalPages };
    }
    async getById(id) {
        return await prisma.review.findUnique({
            where: { id: Number(id) },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePicture: {
                            select: {
                                id: true,
                                url: true,
                            },
                        },
                    },
                },
                medias: {
                    select: {
                        id: true,
                        url: true,
                    }
                }
            },
        });
    }
    async create(req, body) {
        const isPlace = body.placeId ? true : false;
        const isActivity = body.activityId ? true : false;
        const isAlreadyReviewed = await prisma.review.findFirst({
            where: Object.assign(Object.assign({ authorId: req.user.id }, (isPlace
                ? {
                    placeId: Number(body.placeId),
                }
                : "")), (isActivity
                ? {
                    activityId: Number(body.activityId),
                }
                : "")),
        });
        if (isAlreadyReviewed) {
            throw new Error("You have already reviewed this place or activity");
        }
        if ((isPlace && isActivity) || (!isPlace && !isActivity)) {
            throw new Error("You have to define either place or activity to review");
        }
        try {
            const review = await prisma.review.create({
                data: Object.assign(Object.assign(Object.assign(Object.assign({ author: {
                        connect: {
                            id: req.user.id,
                        },
                    } }, (isPlace
                    ? {
                        place: {
                            connect: {
                                id: Number(body.placeId),
                            },
                        },
                    }
                    : "")), (isActivity
                    ? {
                        activity: {
                            connect: {
                                id: Number(body.activityId),
                            },
                        },
                    }
                    : "")), { rating: Number(body.rating) }), (body.description ? { description: body.description } : "")),
                include: {
                    author: {
                        select: {
                            firstName: true,
                            lastName: true,
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
            if (req.files) {
                req.files.forEach(async (file) => {
                    await prisma.media.create({
                        data: {
                            name: (0, utils_1.sanitizeFileName)(file.originalname),
                            url: "https://" +
                                const_1.CDN_STORAGE_ZONE +
                                ".b-cdn.net/" +
                                const_1.CDN_STORAGE_PATH +
                                "/" +
                                file.uploadName,
                            type: client_1.MediaType.IMAGE,
                            review: {
                                connect: {
                                    id: review.id,
                                },
                            },
                        },
                    });
                });
            }
            isPlace
                ? this.placeService.refreshRating(body.placeId)
                : this.activityService.refreshRating(body.activityId);
            return review;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async update(id, req, body) {
        const review = await prisma.review.update({
            where: { id: Number(id) },
            data: Object.assign(Object.assign({}, (body.rating ? { rating: Number(body.rating) } : "")), (body.description ? { description: body.description } : "")),
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
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
        if (req.files) {
            req.files.foreach(async (file) => {
                await prisma.media.create({
                    data: {
                        name: (0, utils_1.sanitizeFileName)(file.originalname),
                        url: "https://" +
                            const_1.CDN_STORAGE_ZONE +
                            ".b-cdn.net/" +
                            const_1.CDN_STORAGE_PATH +
                            "/" +
                            file.uploadName,
                        type: client_1.MediaType.IMAGE,
                        review: {
                            connect: {
                                id: review.id,
                            },
                        },
                    },
                });
            });
        }
        review.placeId ? this.placeService.refreshRating(review.placeId) : "";
        review.activityId
            ? this.activityService.refreshRating(review.activityId)
            : "";
        return review;
    }
    async delete(id) {
        const review = await prisma.review.delete({
            where: { id: Number(id) },
        });
        review.placeId ? this.placeService.refreshRating(review.placeId) : "";
        review.activityId
            ? this.activityService.refreshRating(review.activityId)
            : "";
        return review;
    }
    async getOwnerId(id) {
        return (await prisma.review.findUnique({
            where: { id: Number(id) },
            select: {
                userId: true,
            },
        })).userId;
    }
};
ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [place_service_1.PlaceService,
        activity_service_1.ActivityService])
], ReviewService);
exports.ReviewService = ReviewService;
//# sourceMappingURL=review.service.js.map