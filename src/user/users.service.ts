import { Injectable } from "@nestjs/common";
import { MediaType, PrismaClient, Role, UserStatus } from "@prisma/client";
import { CDN_STORAGE_PATH, CDN_STORAGE_ZONE } from "src/const";
import { getPagination, sanitizeFileName } from "src/utils";
import {
  changeUserRoleDto,
  GetUsersParamsDto,
  updatePasswordDto,
  updateUserDto,
  updateUserStatusDto,
} from "./user.dto";
import * as bcrypt from "bcrypt";

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
    return user ? user : null;
  }

  async changeRole(id: string, body: changeUserRoleDto) {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      return null;
    }
    const userUpdated = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: Role[body.role],
      },
    });
    return userUpdated ? exclude(userUpdated, "password") : null;
  }

  async update(id: string, req: any, body: updateUserDto) {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    })
    if (!user) {
      return null;
    }
    const userUpdated = await prisma.user.update({
      where: {
        id: Number(user.id),
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
            user: { connect: { id: Number(user.id) } },
          },
        });
      } catch (err) {
        throw err;
      }
    }
    return userUpdated ? exclude(userUpdated, "password") : null;
  }

  async delete(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    })
    if (!user) {
      return null;
    }
    const deletedUser = await prisma.user.update({
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
    return deletedUser ? exclude(deletedUser, "password") : null;
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
    return user? user.role : null;
  }

  async getStatus(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        status: true,
      },
    });
    return user? user.status : null;
  }

  async updateStatus(id: string, body: updateUserStatusDto) {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      return null;
    }
    const userUpdated = await prisma.user.update({
      where: {
        id: Number(user.id),
      },
      data: {
        status: UserStatus[body.status],
      },
    });
    return userUpdated ? exclude(userUpdated, "password") : null;
  }

  async updatePassword(id: string, body: updatePasswordDto) {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      return null;
    }
    const userUpdated = await prisma.user.update({
      where: {
        id: Number(user.id),
      },
      data: {
        password: bcrypt.hashSync(body.password, 10)
      },
    });
    return userUpdated ? exclude(userUpdated, "password") : null;
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
