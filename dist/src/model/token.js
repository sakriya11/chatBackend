"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "IUser" },
    token: { type: Number },
}, { timestamps: true });
const token = (0, mongoose_1.model)("token", tokenSchema);
exports.default = token;
//# sourceMappingURL=token.js.map