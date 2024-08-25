"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const config = {
    app: {
        port: process.env.PORT,
        host: process.env.HOST,
        url: process.env.URL,
        allowedOrigin: process.env.ALLOWED_ORIGIN,
        originRegex: process.env.ORIGIN_REGEX
    },
    db: {
        mongoURL: process.env.MONGO_URL
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        issuer: process.env.JWT_ISSUER,
        token_ttl: process.env.JWT_TOKEN_TTL,
        token_ttl_seconds: Number(process.env.JWT_TOKEN_TTL_SECONDS) || 24 * 60 * 60,
    },
    email: {
        sender_email: process.env.SENDER_EMAIL,
        sender_email_pass: process.env.SENDER_EMAIL_PASS, //app password
        email_service: process.env.EMAIL_SERVICE,
        host: "smtp.gmail.com",
        port: 587,
    }
};
exports.default = config;
//# sourceMappingURL=index.js.map