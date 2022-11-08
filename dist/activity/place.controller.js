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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const place_dto_1 = require("./place.dto");
const place_service_1 = require("./place.service");
const errorsHandler_1 = require("../prisma/errorsHandler");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
let PlaceController = class PlaceController {
    constructor(placeService) {
        this.placeService = placeService;
    }
    async getAll(res) {
        this.placeService
            .getAll()
            .then((places) => {
            res.status(200).send(places);
        })
            .catch((err) => {
            res.status(500).send(err);
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
            res.status(500).send(err);
        });
    }
    async getByCategory(categoryId, res) {
        this.placeService
            .getByCategory(categoryId)
            .then((places) => {
            res.status(200).send(places);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async getByName(name, res) {
        this.placeService
            .getByName(name)
            .then((place) => {
            place
                ? res.status(200).send(place)
                : res.status(404).send("Place not found");
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async getActivities(id, res) {
        this.placeService
            .getActivities(id)
            .then((activities) => {
            res.status(200).send(activities);
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async create(body, req, res) {
        this.placeService
            .create(req, body)
            .then((place) => {
            res.status(201).send(place);
        })
            .catch((err) => {
            res.status(500).send((0, errorsHandler_1.prismaErrorHandler)(err));
        });
    }
    async createActivity(id, body, req, res) {
        this.placeService
            .createActivity(id, req, body)
            .then((activity) => {
            res.status(201).send(activity);
        })
            .catch((err) => {
            res.status(500).send((0, errorsHandler_1.prismaErrorHandler)(err));
        });
    }
    async update(id, body, req, res) {
        this.placeService
            .update(id, body)
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
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)("category/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "getByCategory", null);
__decorate([
    (0, common_1.Get)("search/:name"),
    __param(0, (0, common_1.Param)("name")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "getByName", null);
__decorate([
    (0, common_1.Get)(":id/activities"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "getActivities", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "MERCHANT"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof place_dto_1.createPlaceDto !== "undefined" && place_dto_1.createPlaceDto) === "function" ? _b : Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(":id/activities"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "MERCHANT"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof place_dto_1.createActivityDto !== "undefined" && place_dto_1.createActivityDto) === "function" ? _c : Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "createActivity", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "MERCHANT"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof place_dto_1.updatePlaceDto !== "undefined" && place_dto_1.updatePlaceDto) === "function" ? _d : Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "MERCHANT"),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "delete", null);
PlaceController = __decorate([
    (0, common_1.Controller)("places"),
    __metadata("design:paramtypes", [typeof (_a = typeof place_service_1.PlaceService !== "undefined" && place_service_1.PlaceService) === "function" ? _a : Object])
], PlaceController);
exports.PlaceController = PlaceController;
//# sourceMappingURL=place.controller.js.map