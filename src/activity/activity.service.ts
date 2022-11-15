import { Injectable } from "@nestjs/common";
import { updateActivityDto } from "./activity.dto";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

@Injectable()
export class ActivityService {
  async getAll() {
    return await prisma.activity.findMany({
      include: {
        medias: true,
      },
    });
  }

  async getById(id: string) {
    return await prisma.activity.findUnique({
      where: { id: Number(id) },
      include: {
        medias: true,
      },
    });
  }

  async getByName(name: string) {
    return await prisma.activity.findMany({
      where: {
        name: {
          search: name,
        },
      },
      include:{
        medias: true,
      }
    });
  }

  async getByCategory(categoryId: string) {
    return await prisma.activity.findMany({
      where: {
        place: {
          placeTypeId: Number(categoryId),
        },
      },
      include:{
        medias: true,
      }
    });
  }

  async update(id: string, body: updateActivityDto) {
    return await prisma.activity.update({
      where: { id: Number(id) },
      data: body,
      include:{
        medias: true,
      }
    });
  }

  async delete(id: string) {
    return await prisma.activity.delete({
      where: { id: Number(id) },
    });
  }
}
