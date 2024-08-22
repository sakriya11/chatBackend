"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.mailOption = exports.transport = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const transportConfig = {
    service: config_1.default.email.email_service,
    auth: {
        user: config_1.default.email.sender_email,
        pass: config_1.default.email.sender_email_pass,
    },
    host: config_1.default.email.host,
    port: config_1.default.email.port,
    secure: false,
};
exports.transport = nodemailer_1.default.createTransport(transportConfig);
const mailOption = (to, name, code) => {
    return {
        from: config_1.default.email.sender_email,
        to: to,
        subject: "Email verification code",
        html: `Hello ${name} welcome to chat application. 
    Your registeration code is  ${code}`,
    };
};
exports.mailOption = mailOption;
const sendEmail = (mailOption, transport) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transport.sendMail(mailOption);
        console.log("email sent");
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.sendEmail = sendEmail;
//# sourceMappingURL=emailverification.js.map