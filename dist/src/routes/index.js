"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const chat_1 = __importDefault(require("./chat"));
const auth_1 = __importDefault(require("../middleware/auth"));
const routes = (0, express_1.default)();
routes.use(user_1.default);
routes.use(auth_1.default.verifyToken, chat_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map