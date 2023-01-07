import { Injectable } from '@nestjs/common';
import { createPlaceTypeDto } from './place-type.dto';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

@Injectable()
export class PlaceTypeService {
    async getAll() {
        return await prisma.placeType.findMany();
    }

    async getById(id: string) {
        return await prisma.placeType.findUnique({
            where: { id: Number(id) },
        });
    }

    async create(req, body: createPlaceTypeDto) {
        return await prisma.placeType.create({
            data: {
                name: body.name,
            },
        });
    }

    async delete(id: string) {
        return await prisma.placeType.delete({
            where: { id: Number(id) },
        });
    }
}
