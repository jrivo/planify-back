"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.sendVerificationEmail = exports.getPagination = exports.removeObjectKeys = exports.flattenObject = exports.redeserialize = exports.sanitizeFileName = exports.generateRandomFileName = exports.generateToken = void 0;
const const_1 = require("./const");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(const_1.SENDGRID_API_KEY);
const generateToken = function (length = 32) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.generateToken = generateToken;
const generateRandomFileName = function (extension, length = 8) {
    var result = (0, exports.generateToken)();
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
const flattenObject = function (obj, prefix = "") {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    return Object.keys(obj).reduce((acc, key) => {
        if (typeof obj[key] === "object") {
            Object.assign(acc, (0, exports.flattenObject)(obj[key], `${prefix}${key}_`));
        }
        else {
            acc[`${prefix}${key}`] = obj[key];
        }
        return acc;
    }, {});
};
exports.flattenObject = flattenObject;
const removeObjectKeys = function (obj, keys) {
    keys.forEach((key) => delete obj[key]);
    return obj;
};
exports.removeObjectKeys = removeObjectKeys;
const getPagination = function (page, limit, defaultLimit) {
    let pagination = {};
    if (page) {
        limit
            ? (pagination["take"] = Number(limit))
            : (pagination["take"] = defaultLimit);
        pagination["skip"] = Number((page - 1) * pagination["take"]);
    }
    return pagination;
};
exports.getPagination = getPagination;
const sendVerificationEmail = function (to, token) {
    const message = {
        to: to,
        from: "planify.esgi.app@gmail.com",
        subject: "Planify - Email Verification",
        templateId: "d-df277feb6dab4077a17979b4b17123c4",
        dynamic_template_data: {
            verification_link: `http://${const_1.APP_URL}/email-verification?token=${token}`,
        },
    };
    sgMail
        .send(message)
        .then((res) => {
        console.log(res);
        console.log("Email sent");
    })
        .catch((error) => {
        console.error(error);
    });
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendResetPasswordEmail = function (to, password) {
    const message = {
        to: to,
        from: "planify.esgi.app@gmail.com",
        subject: "Planify - Reset Password",
        templateId: "d-8269cccc14a544a28248454a1d80a73b",
        dynamic_template_data: {
            new_password: password,
        },
    };
    sgMail
        .send(message).then((res) => {
        console.log(res);
    })
        .catch((error) => {
        console.error(error);
    });
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
//# sourceMappingURL=utils.js.map