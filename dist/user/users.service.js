"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const const_1 = require("../const");
const utils_1 = require("../utils");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
const DEFAULT_LIMIT = 10;
let UsersService = class UsersService {
    async getAll(queries) {
        const pagination = (0, utils_1.getPagination)(queries.page, queries.limit, DEFAULT_LIMIT);
        const limit = queries.limit ? queries.limit : DEFAULT_LIMIT;
        const whereConditions = {
            where: Object.assign(Object.assign({}, (queries.role ? { role: client_1.Role[queries.role.toUpperCase()] } : "")), (queries.search
                ? {
                    OR: [
                        { firstName: { contains: queries.search } },
                        { lastName: { contains: queries.search } },
                        { email: { contains: queries.search } },
                    ],
                }
                : "")),
        };
        const totalPages = Math.ceil((await prisma.user.count(Object.assign({}, whereConditions))) / limit);
        let users = await prisma.user.findMany(Object.assign(Object.assign(Object.assign({}, whereConditions), { include: {
                profilePicture: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
            }, orderBy: {
                createdAt: "desc",
            } }), (pagination
            ? { take: pagination["take"], skip: pagination["skip"] }
            : "")));
        return {
            users: users.map((user) => exclude(user, "password")),
            totalPages,
        };
    }
    async findById(id, params = null) {
        const user = await prisma.user.findUnique(Object.assign({ where: {
                id: Number(id),
            }, include: {
                profilePicture: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
            } }, params));
        return exclude(user, "password");
    }
    async findByEmail(email, params = null) {
        const user = await prisma.user.findUnique(Object.assign({ where: {
                email: email,
            } }, params));
        return user ? user : null;
    }
    async changeRole(id, body) {
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
                role: client_1.Role[body.role],
            },
        });
        return userUpdated ? exclude(userUpdated, "password") : null;
    }
    async update(id, req, body) {
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
                        name: (0, utils_1.sanitizeFileName)(file.originalname),
                        url: "https://" +
                            const_1.CDN_STORAGE_ZONE +
                            ".b-cdn.net/" +
                            const_1.CDN_STORAGE_PATH +
                            "/" +
                            file.uploadName,
                        type: client_1.MediaType.IMAGE,
                        user: { connect: { id: Number(user.id) } },
                    },
                });
            }
            catch (err) {
                throw err;
            }
        }
        return userUpdated ? exclude(userUpdated, "password") : null;
    }
    async delete(id) {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
        });
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
                role: client_1.Role.DELETED,
                profilePicture: {
                    disconnect: true,
                },
                deletedAt: new Date(),
            },
        });
        return deletedUser ? exclude(deletedUser, "password") : null;
    }
    async getRole(id) {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
            select: {
                role: true,
            },
        });
        return user ? user.role : null;
    }
    async getStatus(id) {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
            select: {
                status: true,
            },
        });
        return user ? user.status : null;
    }
    async updateStatus(id, body) {
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
                status: client_1.UserStatus[body.status],
            },
        });
        return userUpdated ? exclude(userUpdated, "password") : null;
    }
    async updatePassword(id, body) {
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
};
UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
exports.UsersService = UsersService;
function exclude(user, ...keys) {
    for (let key of keys) {
        delete user[key];
    }
    return user;
}
//# sourceMappingURL=users.service.js.map