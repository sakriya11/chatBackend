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
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../model/user"));
const authMiddleware = {
    verifyToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { host, authorization } = req.headers;
            const validHosts = config_1.default.frontend.host;
            console.log(validHosts, host);
            let accessToken;
            if (validHosts.includes(host)) {
                accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
            }
            if (!accessToken) {
                if (!authorization) {
                    res
                        .status(403)
                        .send({ ok: false, message: "Not authorized. Please login." });
                    return;
                }
                accessToken = authorization.split("Bearer ")[1];
                if (!accessToken) {
                    throw "Token should be Bearer token";
                }
            }
            const decoded = jsonwebtoken_1.default.verify(accessToken, config_1.default.jwt.secret, {
                issuer: config_1.default.jwt.issuer,
            });
            const user = yield user_1.default.findById(decoded.id).select("-password");
            if (user) {
                req.user = user;
            }
            else {
                res.status(401).send({
                    ok: false,
                    message: "Signed user not found. Please login again",
                });
                return;
            }
            next();
        }
        catch (error) {
            if (error.name === "TokenExpiredError" ||
                error.name === "JsonWebTokenError") {
                res.status(401).send({
                    ok: false,
                    code: error.name,
                    message: "Session Expired. Please Login again",
                });
                return;
            }
            console.error(error);
            res.status(422).send({
                ok: false,
                error: true,
                message: "Please login and try again.",
            });
        }
    }),
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.js.map