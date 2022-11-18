"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdnService = void 0;
const common_1 = require("@nestjs/common");
const const_1 = require("../const");
const utils_1 = require("../utils");
const cross_fetch_1 = require("cross-fetch");
let CdnService = class CdnService {
    async upload(req, files) {
        console.log("UPLOAD");
        files.forEach((file) => {
            const uploadName = (0, utils_1.generateRandomFileName)(file.originalname.split(".")[1], 20);
            file.uploadName = uploadName;
            const url = const_1.CDN_URL + const_1.CDN_STORAGE_ZONE + "/" + const_1.CDN_STORAGE_PATH + "/" + uploadName;
            const options = {
                method: "PUT",
                headers: {
                    AccessKey: const_1.CDN_ACCESS_KEY,
                    "Content-Type": "octet-stream",
                    "Content-Length": file.buffer.length,
                },
                body: file.buffer,
            };
            console.log(url);
            (0, cross_fetch_1.default)(url, options)
                .then((res) => {
                console.log(res);
                res.json();
            })
                .then((json) => {
                console.log(json);
                req.files.push(file);
            })
                .catch((err) => console.error("error:" + err));
        });
        return req;
    }
};
CdnService = __decorate([
    (0, common_1.Injectable)()
], CdnService);
exports.CdnService = CdnService;
//# sourceMappingURL=cdn.service.js.map