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
const user_1 = __importDefault(require("../model/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const token_1 = __importDefault(require("../model/token"));
const emailverification_1 = require("../services/emailverification");
const generator_1 = require("../helper/generator");
// import {  socketTokenValidation } from "../config/socket/socketConnection";
const authController = {
    userRegistration: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { fullname, email, password, confirmpassword } = req.body;
            // console.log("request",req.body);
            const emailExist = yield user_1.default.findOne({
                email: email,
            });
            if (emailExist) {
                return res.status(409).send({
                    message: "Given email id already exist",
                });
            }
            if (password !== confirmpassword) {
                return res.status(409).send({
                    message: "Password and confirm password did not match",
                });
            }
            const registerUser = yield user_1.default.create({
                fullname,
                email,
                password: bcryptjs_1.default.hashSync(password),
            });
            const emailVerificationToken = yield token_1.default.create({
                user: registerUser.id,
                token: (0, generator_1.genRandomNumber)(),
            });
            const option = (0, emailverification_1.mailOption)(registerUser.email, registerUser.fullname, emailVerificationToken.token);
            yield (0, emailverification_1.sendEmail)(option, emailverification_1.transport);
            return res.status(200).send({
                message: "Enter the code provided to your email",
            });
        }
        catch (error) {
            console.log("registration error", error);
            return res.status(500).send({
                message: "Registration error",
            });
        }
    }),
    emailVerification: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { verificationCode } = req.body;
            const verifyCode = Number(verificationCode);
            const tokenExist = yield token_1.default.findOne({
                token: verifyCode,
            });
            if (tokenExist) {
                yield user_1.default.findByIdAndUpdate(tokenExist.user, {
                    emailVerified: true,
                });
                return res.status(200).send({
                    message: "Email verified and user registered succesfully",
                });
            }
            else {
                return res.status(409).send({
                    message: "Email verification failed please sign up and resend the verification code ",
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                message: "email not verified",
            });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield user_1.default.findOne({ email: email });
            if (!user) {
                return res.status(404).send({
                    message: "User does not exist please register",
                });
            }
            if (user.emailVerified == false) {
                return res.status(409).send({
                    message: "Verify email and try logging back to your account",
                });
            }
            const passwordIsValid = bcryptjs_1.default.compareSync(password, user.password);
            if (!passwordIsValid) {
                return res.status(409).send({
                    message: "Incorrect password",
                });
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
            }, config_1.default.jwt.secret, {
                expiresIn: config_1.default.jwt.token_ttl,
                issuer: config_1.default.jwt.issuer,
            });
            const resUser = user.toJSON();
            delete resUser.password;
            yield user_1.default.findByIdAndUpdate({
                _id: user.id,
            }, {
                active: true,
            });
            return res.status(200).send({
                message: "Logged in succesfully",
                accessToken: token,
                user: resUser,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({
                message: "An error occurred during login.",
            });
        }
    }),
};
exports.default = authController;
//# sourceMappingURL=user.js.map