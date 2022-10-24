import { Injectable } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
@Injectable()
export class UsersService {
  async findById(id: string, params: object = null): Promise<any | undefined> {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      ...params,
    });
    return exclude(user, 'password');
  }
  async findByEmail(
    email: string,
    params: object = null,
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
    return exclude(user, 'password');
  }

  async delete(id: string) {
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: 'DELETED',
        organization: {
          disconnect: true,
        },
        deletedAt: new Date(),
      },
    });
    return exclude(user, 'password');
  }

  async getOrganizationId(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        organization: {
          select: {
            id: true,
          },
        },
      },
    });
    return user.organization.id;
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
