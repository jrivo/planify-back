"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const notBanned_guard_1 = require("../auth/notBanned.guard");
const ownerOrAdmin_decorator_1 = require("../auth/ownerOrAdmin.decorator");
const ownerOrAdmin_guard_1 = require("../auth/ownerOrAdmin.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const self_guard_1 = require("../auth/self.guard");
const cdn_service_1 = require("../cdn/cdn.service");
const user_dto_1 = require("./user.dto");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(userService, cdnService) {
        this.userService = userService;
        this.cdnService = cdnService;
    }
    async getAll(res, queries) {
        this.userService
            .getAll(queries)
            .then((users) => {
            res.status(200).send(users);
        })
            .catch((err) => {
            res.status(500).send;
        });
    }
    getById(id, res) {
        this.userService
            .findById(id)
            .then((user) => {
            user
                ? res.status(200).send(user)
                : res.status(404).send("User not found");
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async updateUser(id, req, body, res, files) {
        files ? (req = await this.cdnService.upload(req, files)) : null;
        this.userService
            .update(id, req, body)
            .then((user) => {
            user
                ? res.status(200).send(user)
                : res.status(404).send("User not found");
        })
            .catch((err) => {
            res.status(500).send;
        });
    }
    async delete(id, res) {
        this.userService
            .delete(id)
            .then((data) => {
            data
                ? res.status(200).send("User deleted")
                : res.status(404).send("User not found");
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async updateRole(id, body, res) {
        this.userService
            .changeRole(id, body)
            .then((user) => {
            user
                ? res.status(200).send(user)
                : res.status(404).send("User not found");
        })
            .catch((err) => {
            res.status(500).send;
        });
    }
    async blockUser(id, body, res) {
        this.userService
            .updateStatus(id, body)
            .then((user) => {
            user
                ? res.status(200).send(user)
                : res.status(404).send("User not found");
        })
            .catch((err) => {
            res.status(500).send;
        });
    }
    async updatePassword(id, body, res) {
        this.userService
            .updatePassword(id, body)
            .then((user) => {
            user
                ? res.status(200).send({ message: "Password updated" })
                : res.status(404).send({ error: "User not found" });
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "MODERATOR"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.GetUsersParamsDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "MODERATOR"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getById", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, ownerOrAdmin_guard_1.OwnerOrAdminGuard, notBanned_guard_1.NotBannedGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __param(4, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, user_dto_1.updateUserDto, Object, Array]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, ownerOrAdmin_guard_1.OwnerOrAdminGuard, notBanned_guard_1.NotBannedGuard),
    (0, ownerOrAdmin_decorator_1.Entity)("user"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(":id/role"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.changeUserRoleDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Put)(":id/status"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "MODERATOR"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.updateUserStatusDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Put)(":id/password"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, self_guard_1.SelfGuard, notBanned_guard_1.NotBannedGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.updatePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
UsersController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        cdn_service_1.CdnService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map