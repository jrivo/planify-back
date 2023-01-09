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
exports.TripController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const errorsHandler_1 = require("../prisma/errorsHandler");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const trip_service_1 = require("./trip.service");
const trip_dto_1 = require("./trip.dto");
const ownerAdminOrModerator_guard_ts_1 = require("../auth/ownerAdminOrModerator.guard.ts");
const ownerOrAdmin_decorator_1 = require("../auth/ownerOrAdmin.decorator");
const notBanned_guard_1 = require("../auth/notBanned.guard");
let TripController = class TripController {
    constructor(tripService) {
        this.tripService = tripService;
    }
    async getAll(req, res) {
        this.tripService
            .getUserAll(req.user.id)
            .then((trips) => {
            res.status(200).send(trips);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async getById(id, res) {
        this.tripService
            .getById(id)
            .then((trip) => {
            trip
                ? res.status(200).send(trip)
                : res.status(404).send("Trip not found");
        })
            .catch((err) => {
            res.status(500).send((0, errorsHandler_1.prismaErrorHandler)(err));
        });
    }
    async getByName(name, res) {
        this.tripService
            .getByName(name)
            .then((trips) => {
            res.status(200).send(trips);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async create(req, body, res) {
        this.tripService
            .create(req, body)
            .then((trip) => {
            res.status(201).send(trip);
        })
            .catch((err) => {
            res.status(500).send((0, errorsHandler_1.prismaErrorHandler)(err));
        });
    }
    async getActivities(id, res) {
        this.tripService
            .getActivities(id)
            .then((activities) => {
            res.status(200).send(activities);
        })
            .catch((err) => {
            res
                .status(500)
                .send((0, errorsHandler_1.prismaErrorHandler)(err));
        });
    }
    async addActivity(id, body, res) {
        this.tripService
            .addActivity(id, body.activityId)
            .then((trip) => {
            res.status(200).send(trip);
        })
            .catch((err) => {
            res.status(500).send(err.message);
        });
    }
    async removeActivity(id, body, res) {
        this.tripService
            .removeActivity(id, body.activityId)
            .then((trip) => {
            res.status(200).send(trip);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async update(id, body, res) {
        this.tripService
            .update(id, body)
            .then((trip) => {
            res.status(200).send(trip);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async delete(id, res) {
        this.tripService
            .delete(id)
            .then(() => {
            res.status(202).send();
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)("search/:name"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("name")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "getByName", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, notBanned_guard_1.NotBannedGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "USER"),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trip_dto_1.createTripDto, Object]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":id/activities"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "USER"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "getActivities", null);
__decorate([
    (0, common_1.Post)(":id/activities"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, notBanned_guard_1.NotBannedGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "MODERATOR", "USER"),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "addActivity", null);
__decorate([
    (0, common_1.Put)(":id/activities"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, ownerAdminOrModerator_guard_ts_1.OwnerAdminOrModeratorGuard, notBanned_guard_1.NotBannedGuard),
    (0, ownerOrAdmin_decorator_1.Entity)("trip"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "removeActivity", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, ownerAdminOrModerator_guard_ts_1.OwnerAdminOrModeratorGuard, notBanned_guard_1.NotBannedGuard),
    (0, ownerOrAdmin_decorator_1.Entity)("trip"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, trip_dto_1.updateTripDto, Object]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, ownerAdminOrModerator_guard_ts_1.OwnerAdminOrModeratorGuard, notBanned_guard_1.NotBannedGuard),
    (0, ownerOrAdmin_decorator_1.Entity)("trip"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "delete", null);
TripController = __decorate([
    (0, common_1.Controller)("trips"),
    __metadata("design:paramtypes", [trip_service_1.TripService])
], TripController);
exports.TripController = TripController;
//# sourceMappingURL=trip.controller.js.map