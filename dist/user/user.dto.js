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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordDto = exports.updateUserStatusDto = exports.changeUserRoleDto = exports.GetUsersParamsDto = exports.updateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class updateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: false, type: () => String }, password: { required: false, type: () => String }, firstName: { required: false, type: () => String }, lastName: { required: false, type: () => String }, phoneNumber: { required: false, type: () => String }, street: { required: false, type: () => String }, streetNumber: { required: false, type: () => String }, city: { required: false, type: () => String }, postalCode: { required: false, type: () => String }, country: { required: false, type: () => String }, region: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "street", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "streetNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "postalCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updateUserDto.prototype, "region", void 0);
exports.updateUserDto = updateUserDto;
class GetUsersParamsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, search: { required: true, type: () => String }, role: { required: true, type: () => String, enum: ["admin", "user", "moderator"] } };
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], GetUsersParamsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], GetUsersParamsDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GetUsersParamsDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["admin", "user", "moderator"]),
    __metadata("design:type", String)
], GetUsersParamsDto.prototype, "role", void 0);
exports.GetUsersParamsDto = GetUsersParamsDto;
class changeUserRoleDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { role: { required: true, type: () => String, enum: ["ADMIN", "USER", "MODERATOR", "MERCHANT"] } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(["ADMIN", "USER", "MODERATOR", "MERCHANT"]),
    __metadata("design:type", String)
], changeUserRoleDto.prototype, "role", void 0);
exports.changeUserRoleDto = changeUserRoleDto;
class updateUserStatusDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: true, type: () => String, enum: ["BLOCKED", "BANNED", "VERIFIED"] } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(["BLOCKED", "BANNED", "VERIFIED"]),
    __metadata("design:type", String)
], updateUserStatusDto.prototype, "status", void 0);
exports.updateUserStatusDto = updateUserStatusDto;
class updatePasswordDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { password: { required: true, type: () => String, minLength: 8 } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8),
    __metadata("design:type", String)
], updatePasswordDto.prototype, "password", void 0);
exports.updatePasswordDto = updatePasswordDto;
//# sourceMappingURL=user.dto.js.map