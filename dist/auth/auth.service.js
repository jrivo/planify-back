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
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const const_1 = require("../const");
const bcrypt = require("bcrypt");
const utils_1 = require("../utils");
const users_service_1 = require("../user/users.service");
const constants_1 = require("./constants");
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
            console.log("oops");
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const payload = { sub: user.id, email: user.email };
        return {
            id: user.id,
            email: user.email,
            access_token: this.jwtService.sign(payload, {
                secret: constants_1.jwtConstants.secret,
            }),
        };
    }
    async register(req, body) {
        const user = await this.usersService.findByEmail(body.email);
        if (user) {
            throw new common_1.UnauthorizedException("User already exists");
        }
        const isAddress = body.street && body.streetNumber && body.city;
        let address = isAddress
            ? await prisma.address.create({
                data: {
                    street: body.street,
                    streetNumber: body.streetNumber,
                    city: body.city,
                    postalCode: body.postalCode,
                    country: body.country,
                    region: body.region && body.region,
                },
            })
            : null;
        let newUser = await prisma.user.create({
            data: {
                email: body.email,
                password: bcrypt.hashSync(body.password, const_1.BCRYPT_SALT_ROUNDS),
                firstName: body.firstName,
                lastName: body.lastName,
                phone: body.phoneNumber && body.phoneNumber,
                address: address ? { connect: { id: address.id } } : undefined,
                role: client_1.Role[body.role],
            },
            include: {
                profilePicture: true,
                address: true,
            },
        });
        if (req.files) {
            try {
                req.files.forEach(async (file) => {
                    let type = client_1.MediaType.IMAGE;
                    await prisma.media.create({
                        data: {
                            name: (0, utils_1.sanitizeFileName)(file.originalname),
                            url: "https://" +
                                const_1.CDN_STORAGE_ZONE +
                                ".b-cdn.net/" +
                                const_1.CDN_STORAGE_PATH +
                                "/" +
                                file.uploadName,
                            type: type,
                            user: { connect: { id: Number(newUser.id) } },
                        },
                    });
                });
            }
            catch (err) {
                throw err;
            }
        }
        const payload = { sub: newUser.id, email: newUser.email };
        return {
            id: newUser.id,
            email: newUser.email,
            access_token: this.jwtService.sign(payload, {
                secret: constants_1.jwtConstants.secret,
            }),
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