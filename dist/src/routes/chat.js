"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_1 = __importDefault(require("../controller/chat"));
const chatRouter = (0, express_1.Router)();
chatRouter
    .get("/get/all/user", chat_1.default.totalUsers)
    .get("/get/all/chat/:id", chat_1.default.fetchIndividualUserMessages)
    .patch("/update/status/:id", chat_1.default.updateUserStatus)
    .delete("/delete/:id", chat_1.default.deleteSingleChat)
    .get("/get/roomid", chat_1.default.generateuserId);
exports.default = chatRouter;
//# sourceMappingURL=chat.js.map