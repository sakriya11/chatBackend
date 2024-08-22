"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../controller/user"));
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
userRouter
    .post("/create/user", user_1.default.userRegistration)
    .post("/login", user_1.default.login)
    .post("/user/email/verification", user_1.default.emailVerification);
exports.default = userRouter;
//# sourceMappingURL=user.js.map