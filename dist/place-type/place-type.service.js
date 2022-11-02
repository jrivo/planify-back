"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceTypeService = void 0;
const common_1 = require("@nestjs/common");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
let PlaceTypeService = class PlaceTypeService {
    async getAll() {
        return await prisma.placeType.findMany();
    }
    async getById(id) {
        return await prisma.placeType.findUnique({
            where: { id: Number(id) },
        });
    }
    async create(req, body) {
        return await prisma.placeType.create({
            data: {
                name: body.name,
            },
        });
    }
    async delete(id) {
        return await prisma.placeType.delete({
            where: { id: Number(id) },
        });
    }
};
PlaceTypeService = __decorate([
    (0, common_1.Injectable)()
], PlaceTypeService);
exports.PlaceTypeService = PlaceTypeService;
//# sourceMappingURL=place-type.service.js.map