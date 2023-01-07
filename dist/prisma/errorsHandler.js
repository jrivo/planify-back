"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaErrorHandler = void 0;
function prismaErrorHandler(error) {
    console.log(error, error.code);
    switch (error.code) {
        case 'P2002': {
            return `A record with the same ${error.meta.target.join(',')} already exists`;
        }
        case 'P2025': {
            return error.meta.cause;
        }
        default: {
            return error;
        }
    }
}
exports.prismaErrorHandler = prismaErrorHandler;
//# sourceMappingURL=errorsHandler.js.map