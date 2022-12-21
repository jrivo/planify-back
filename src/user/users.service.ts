import { Injectable } from "@nestjs/common";
import { MediaType, PrismaClient, Role } from "@prisma/client";
import { CDN_STORAGE_PATH, CDN_STORAGE_ZONE } from "src/const";
import { getPagination, sanitizeFileName } from "src/utils";
import { GetUsersParamsDto, updateUserDto } from "./user.dto";

const prisma = new PrismaClient();
const DEFAULT_LIMIT = 10;

@Injectable()
export class UsersService {
  async getAll(queries: GetUsersParamsDto) {
    const pagination = getPagination(
      queries.page,
      queries.limit,
      DEFAULT_LIMIT
    );
    const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
    const whereConditions = {
      where: {
        ...(queries.role ? { role: Role[queries.role.toUpperCase()] } : ""),
        ...(queries.search
          ? {
              OR: [
                { firstName: { contains: queries.search } },
                { lastName: { contains: queries.search } },
                { email: { contains: queries.search } },
              ],
            }
          : ""),
      },
    };
    const totalPages = Math.ceil(
      (await prisma.user.count({ ...whereConditions })) / limit
    );
    let users = await prisma.user.findMany({
      ...whereConditions,
      include: {
        profilePicture: {
          select: {
            id: true,
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(pagination
        ? { take: pagination["take"], skip: pagination["skip"] }
        : ""),
    });
    return {
      users: users.map((user) => exclude(user, "password")),
      totalPages,
    };
  }
  async findById(id: string, params: object = null): Promise<any | undefined> {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        profilePicture: {
          select: {
            id: true,
            url: true,
          },
        },
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
      console.log("entered");
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
    console.log("will return");
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
