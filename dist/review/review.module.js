"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModule = void 0;
const common_1 = require("@nestjs/common");
const review_service_1 = require("./review.service");
const review_controller_1 = require("./review.controller");
const users_module_1 = require("../user/users.module");
const place_module_1 = require("../place/place.module");
const activity_module_1 = require("../activity/activity.module");
const cdn_module_1 = require("../cdn/cdn.module");
const event_module_1 = require("../event/event.module");
const trip_module_1 = require("../trip/trip.module");
let ReviewModule = class ReviewModule {
};
ReviewModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, place_module_1.PlaceModule, activity_module_1.ActivityModule, cdn_module_1.CdnModule, event_module_1.EventModule, trip_module_1.TripModule],
        providers: [review_service_1.ReviewService],
        controllers: [review_controller_1.ReviewController],
        exports: [review_service_1.ReviewService],
    })
], ReviewModule);
exports.ReviewModule = ReviewModule;
//# sourceMappingURL=review.module.js.map