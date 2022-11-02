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
const prisma = new client_1.PrismaClient();
let UsersService = class UsersService {
    async findById(id, params = null) {
        const user = await prisma.user.findUnique(Object.assign({ where: {
                id: Number(id),
            } }, params));
        return exclude(user, 'password');
    }
    async findByEmail(email, params = null) {
        const user = await prisma.user.findUnique(Object.assign({ where: {
                email: email,
            } }, params));
        return user;
    }
    async changeRole(id, role) {
        const user = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                role: client_1.Role[role],
            },
        });
        return exclude(user, 'password');
    }
    async delete(id) {
        const user = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phone: '',
                role: client_1.Role.DELETED,
                profilePicture: {
                    disconnect: true,
                },
                deletedAt: new Date(),
            },
        });
        return exclude(user, 'password');
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