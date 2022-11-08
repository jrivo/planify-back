"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const trip_module_1 = require("./trip/trip.module");
const review_module_1 = require("./review/review.module");
const place_module_1 = require("./place/place.module");
const activity_module_1 = require("./activity/activity.module");
const place_type_module_1 = require("./place-type/place-type.module");
const users_module_1 = require("./user/users.module");
const auth_controller_1 = require("./auth/auth.controller");
const place_controller_1 = require("./place/place.controller");
const auth_service_1 = require("./auth/auth.service");
const place_service_1 = require("./place/place.service");
const users_controller_1 = require("./user/users.controller");
const users_service_1 = require("./user/users.service");
const place_type_controller_1 = require("./place-type/place-type.controller");
const place_type_service_1 = require("./place-type/place-type.service");
const activity_controller_1 = require("./activity/activity.controller");
const activity_service_1 = require("./activity/activity.service");
const trip_service_1 = require("./trip/trip.service");
const trip_controller_1 = require("./trip/trip.controller");
const cdn_service_1 = require("./cdn/cdn.service");
const jwt_1 = require("@nestjs/jwt");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            trip_module_1.TripModule,
            review_module_1.ReviewModule,
            place_module_1.PlaceModule,
            activity_module_1.ActivityModule,
            place_type_module_1.PlaceTypeModule,
            users_module_1.UsersModule,
        ],
        controllers: [
            app_controller_1.AppController,
            auth_controller_1.AuthController,
            place_controller_1.PlaceController,
            users_controller_1.UsersController,
            place_type_controller_1.PlaceTypeController,
            activity_controller_1.ActivityController,
            trip_controller_1.TripController,
        ],
        providers: [
            app_service_1.AppService,
            place_service_1.PlaceService,
            users_service_1.UsersService,
            place_type_service_1.PlaceTypeService,
            activity_service_1.ActivityService,
            trip_service_1.TripService,
            cdn_service_1.CdnService,
            auth_service_1.AuthService,
            jwt_1.JwtService
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map