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
            }
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
            }
        });
    }
    async update(id, body) {
        return await prisma.activity.update({
            where: { id: Number(id) },
            data: body,
            include: {
                medias: true,
            }
        });
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
//# sourceMappingURL=activity.service.js.map