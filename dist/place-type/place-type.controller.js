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
exports.PlaceTypeController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const place_type_dto_1 = require("./place-type.dto");
const place_type_service_1 = require("./place-type.service");
let PlaceTypeController = class PlaceTypeController {
    constructor(placeTypeService) {
        this.placeTypeService = placeTypeService;
    }
    async getAll(res) {
        this.placeTypeService.getAll().then((placeTypes) => {
            res.status(200).send(placeTypes);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }
    async getById(id, res) {
        this.placeTypeService
            .getById(id)
            .then((place) => {
            place
                ? res.status(200).send(place)
                : res.status(404).send("Place type not found");
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async delete(id, res) {
        this.placeTypeService
            .delete(id)
            .then(() => {
            res.status(202).send("Place deleted");
        })
            .catch((err) => {
            res.status(500).send(err);
        });
    }
    async create(body, req) {
        return this.placeTypeService.create(req, body);
    }
};
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlaceTypeController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaceTypeController.prototype, "getById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaceTypeController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [place_type_dto_1.createPlaceTypeDto, Object]),
    __metadata("design:returntype", Promise)
], PlaceTypeController.prototype, "create", null);
PlaceTypeController = __decorate([
    (0, common_1.Controller)("place-types"),
    __metadata("design:paramtypes", [place_type_service_1.PlaceTypeService])
], PlaceTypeController);
exports.PlaceTypeController = PlaceTypeController;
//# sourceMappingURL=place-type.controller.js.map