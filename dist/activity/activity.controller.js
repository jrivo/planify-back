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
exports.ActivityController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const errorsHandler_1 = require("../prisma/errorsHandler");
const activity_service_1 = require("./activity.service");
const activity_dto_1 = require("./activity.dto");
const platform_express_1 = require("@nestjs/platform-express");
const cdn_service_1 = require("../cdn/cdn.service");
const ownerOrAdmin_decorator_1 = require("../auth/ownerOrAdmin.decorator");
const ownerAdminOrModerator_guard_ts_1 = require("../auth/ownerAdminOrModerator.guard.ts");
const notBanned_guard_1 = require("../auth/notBanned.guard");
let ActivityController = class ActivityController {
    constructor(activityService, cdnService) {
        this.activityService = activityService;
        this.cdnService = cdnService;
    }
    async getAll(res, queries) {
        this.activityService
            .getAll(queries)
            .then((activities) => {
            res.status(200).send(activities);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async getSubscribedActivities(req, res) {
        this.activityService
            .getSubscribedActivities(req.user.id)
            .then((activities) => {
            res.status(200).send(activities);
        })
            .catch((err) => {
            res.status(500).send((0, errorsHandler_1.prismaErrorHandler)(err));
        });
    }
    async getById(id, res) {
        this.activityService
            .getById(id)
            .then((activity) => {
            activity
                ? res.status(200).send(activity)
                : res.status(404).send("Activity not found");
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async getActivitySubscribers(id, res) {
        this.activityService
            .getActivitySubscribers(id)
            .then((subscribers) => {
            res.status(200).send(subscribers);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async update(id, body, req, res, files) {
        files ? (req = await this.cdnService.upload(req, files)) : null;
        this.activityService
            .update(id, req, body)
            .then((activity) => {
            res.status(202).send(activity);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async delete(id, res) {
        this.activityService
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
    __metadata("design:paramtypes", [Object, activity_dto_1.getActivitiesParamsDto]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)("subscribed"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "getSubscribedActivities", null);
__decorate([
    (0, common_1.Get)(":id"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)(":id/subscribers"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "getActivitySubscribers", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, ownerAdminOrModerator_guard_ts_1.OwnerAdminOrModeratorGuard, notBanned_guard_1.NotBannedGuard),
    (0, ownerOrAdmin_decorator_1.Entity)("activity"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __param(4, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, activity_dto_1.updateActivityDto, Object, Object, Array]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, ownerAdminOrModerator_guard_ts_1.OwnerAdminOrModeratorGuard, notBanned_guard_1.NotBannedGuard),
    (0, ownerOrAdmin_decorator_1.Entity)("activity"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "delete", null);
ActivityController = __decorate([
    (0, common_1.Controller)("activities"),
    __metadata("design:paramtypes", [activity_service_1.ActivityService,
        cdn_service_1.CdnService])
], ActivityController);
exports.ActivityController = ActivityController;
//# sourceMappingURL=activity.controller.js.map