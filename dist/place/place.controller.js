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
exports.PlaceController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const place_dto_1 = require("./place.dto");
const place_service_1 = require("./place.service");
const errorsHandler_1 = require("../prisma/errorsHandler");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const platform_express_1 = require("@nestjs/platform-express");
const cdn_service_1 = require("../cdn/cdn.service");
const ownerOrAdmin_decorator_1 = require("../auth/ownerOrAdmin.decorator");
const notBlocked_guard_1 = require("../auth/notBlocked.guard");
const ownerAdminOrModerator_guard_ts_1 = require("../auth/ownerAdminOrModerator.guard.ts");
let PlaceController = class PlaceController {
    constructor(placeService, cdnService) {
        this.placeService = placeService;
        this.cdnService = cdnService;
    }
    async getAll(res, queries) {
        this.placeService
            .getAll(queries)
            .then((places) => {
            res.status(200).send(places);
        })
            .catch((err) => {
            res.status(500).send((0, errorsHandler_1.prismaErrorHandler)(err));
        });
    }
    async getById(id, res) {
        this.placeService
            .getById(id)
            .then((place) => {
            place
                ? res.status(200).send(place)
                : res.status(404).send("Place not found");
        })
            .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
    }
    async getActivities(id, res, queries) {
        this.placeService
            .getActivities(id, queries)
            .then((activities) => {
            res.status(200).send(activities);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async create(body, req, res, files) {
        files ? (req = await this.cdnService.upload(req, files)) : null;
        this.placeService
            .create(req, body)
            .then((place) => {
            res.status(201).send(place);
        })
            .catch((err) => {
            res.status(500).send((0, errorsHandler_1.prismaErrorHandler)(err));
        });
    }
    async createActivity(id, body, req, res, files) {
        files ? (req = await this.cdnService.upload(req, files)) : null;
        this.placeService
            .createActivity(id, req, body)
            .then((activity) => {
            res.status(201).send(activity);
        })
            .catch((err) => {
            res.status(500).send((0, errorsHandler_1.prismaErrorHandler)(err));
        });
    }
    async update(id, body, req, res, files) {
        files ? (req = await this.cdnService.upload(req, files)) : null;
        this.placeService
            .update(id, req, body)
            .then((place) => {
            res.status(202).send(place);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async delete(id, res) {
        this.placeService
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
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, place_dto_1.getPlacesParamsDto]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)(":id/activities"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, place_dto_1.getPlaceActivitiesParamsDto]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "getActivities", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, notBlocked_guard_1.NotBlockedGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "MODERATOR", "MERCHANT"),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [place_dto_1.createPlaceDto, Object, Object, Array]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(":id/activities"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, ownerAdminOrModerator_guard_ts_1.OwnerAdminOrModeratorGuard, notBlocked_guard_1.NotBlockedGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    (0, ownerOrAdmin_decorator_1.Entity)("place"),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __param(4, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, place_dto_1.createActivityDto, Object, Object, Array]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "createActivity", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, ownerAdminOrModerator_guard_ts_1.OwnerAdminOrModeratorGuard, notBlocked_guard_1.NotBlockedGuard),
    (0, ownerOrAdmin_decorator_1.Entity)("place"),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __param(4, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, place_dto_1.updatePlaceDto, Object, Object, Array]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, ownerAdminOrModerator_guard_ts_1.OwnerAdminOrModeratorGuard, notBlocked_guard_1.NotBlockedGuard),
    (0, ownerOrAdmin_decorator_1.Entity)("place"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "delete", null);
PlaceController = __decorate([
    (0, common_1.Controller)("places"),
    __metadata("design:paramtypes", [place_service_1.PlaceService,
        cdn_service_1.CdnService])
], PlaceController);
exports.PlaceController = PlaceController;
//# sourceMappingURL=place.controller.js.map