import { Injectable } from "@nestjs/common";
import { MediaType, PrismaClient, Role } from "@prisma/client";
import { CDN_STORAGE_PATH, CDN_STORAGE_ZONE } from "src/const";
import { sanitizeFileName } from "src/utils";
import { updateUserDto } from "./user.dto";

const prisma = new PrismaClient();
@Injectable()
export class UsersService {
  async findById(id: string, params: object = null): Promise<any | undefined> {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        profilePicture: true,
      },
      ...params,
    });
    return exclude(user, "password");
  }
  async findByEmail(
    email: string,
    params: object = null
  ): Promise<any | undefined> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      ...params,
    });
    // return exclude(user, 'password');
    return user;
  }

  async changeRole(id: string, role: string) {
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        role: Role[role],
      },
    });
    return exclude(user, "password");
  }

  async update(id: string, req: any, body: updateUserDto) {
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        firstName: body.firstName && body.firstName,
        lastName: body.lastName && body.lastName,
        phone: body.phoneNumber && body.phoneNumber,
        email: body.email && body.email,
      },
    });
    if (req.files && req.files.length > 0) {
      console.log("entered")
      try {
        const file = req.files[0];
        await prisma.media.create({
          data: {
            name: sanitizeFileName(file.originalname),
            url:
              "https://" +
              CDN_STORAGE_ZONE +
              ".b-cdn.net/" +
              CDN_STORAGE_PATH +
              "/" +
              file.uploadName,
            type: MediaType.IMAGE,
            user: { connect: { id: Number(id) } },
          },
        });
      } catch (err) {
        throw err;
      }
    }
    console.log("will return")
    return exclude(user, "password");
  }

  async delete(id: string) {
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: Role.DELETED,
        profilePicture: {
          disconnect: true,
        },
        deletedAt: new Date(),
      },
    });
    return exclude(user, "password");
  }

  async getRole(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        role: true,
      },
    });
    return user.role;
  }
}

function exclude<User, Key extends keyof User>(
  user: User,
  ...keys: Key[]
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
