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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../user/users.service");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const const_1 = require("../const");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return null;
        if (await bcrypt.compare(pass, user.password)) {
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        }
        return null;
    }
    async login(email, password) {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const payload = { sub: user.id, email: user.email };
        return {
            id: user.id,
            email: user.email,
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(body) {
        const user = await this.usersService.findByEmail(body.email);
        if (user) {
            throw new common_1.UnauthorizedException("User already exists");
        }
        let address = await prisma.address.create({
            data: {
                street: body.address.street,
                streetNumber: body.address.streetNumber,
                city: body.address.city,
                postalCode: body.address.postalCode,
                country: body.address.country,
                region: body.address.region && body.address.region,
            },
        });
        let newUser = await prisma.user.create({
            data: {
                email: body.email,
                password: bcrypt.hashSync(body.password, const_1.BCRYPT_SALT_ROUNDS),
                firstName: body.firstName,
                lastName: body.lastName,
                phone: body.phoneNumber && body.phoneNumber,
                address: { connect: { id: address.id } },
            },
        });
        const payload = { sub: user.id, email: user.email };
        return {
            id: user.id,
            email: user.email,
            access_token: this.jwtService.sign(payload),
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map