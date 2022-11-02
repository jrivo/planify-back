"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeFileName = exports.generateRandomFileName = void 0;
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
//# sourceMappingURL=utils.js.map