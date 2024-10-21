"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    msg: String,
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "IUser" },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "IUser" },
    conversationId: String,
    isRead: Boolean,
    isDelivered: Boolean,
    image: String
    // messageType: String;
    // attachments?: String
    // status?: String;
    // reaction?: String;
    // edited?: boolean;
    // deleted?: boolean;
    // replyTo?: String;
    // forwarded?: boolean;
}, { timestamps: true });
const Chat = (0, mongoose_1.model)("Chat", chatSchema);
exports.default = Chat;
//# sourceMappingURL=chat.js.map