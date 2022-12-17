"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = exports.redeserialize = exports.sanitizeFileName = exports.generateRandomFileName = void 0;
const generateRandomFileName = function (extension, length = 8) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result + "." + extension;
};
exports.generateRandomFileName = generateRandomFileName;
const sanitizeFileName = (fileName) => {
    return fileName.replace(/ /g, "_").replace(/[^a-zA-Z0-9.]/g, "");
};
exports.sanitizeFileName = sanitizeFileName;
const redeserialize = function (object, elements, keysToDelete) {
    elements.forEach((element) => {
        object[element.newKey] = element.data;
    });
    keysToDelete.forEach((key) => delete object[key]);
    return object;
};
exports.redeserialize = redeserialize;
const getPagination = function (page, limit, defaultLimit) {
    let pagination = {};
    if (page) {
        limit ? (pagination["take"] = Number(limit)) : (pagination["take"] = defaultLimit);
        pagination["skip"] = Number((page - 1) * pagination["take"]);
    }
    return pagination;
};
exports.getPagination = getPagination;
//# sourceMappingURL=utils.js.map