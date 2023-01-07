"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Self = void 0;
const common_1 = require("@nestjs/common");
const Self = (params) => (0, common_1.SetMetadata)('selfParams', typeof params == 'string' ? { userIdParam: params } : params);
exports.Self = Self;
//# sourceMappingURL=self.decorator.js.map