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
const chatController = {
    totalUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("origin", req.headers.origin);
            const userToken = req.header;
            console.log(userToken);
            const totalUsers = (yield user_1.default.find());
            if (totalUsers) {
                const userList = [];
                totalUsers.forEach((data) => {
                    const trimedData = {
                        name: data.fullname,
                        id: data.id,
                    };
                    userList.push(trimedData);
                });
                return res.status(200).send({
                    data: userList,
                });
            }
            else {
                return res.status(404).send({
                    message: "No users found",
                });
            }
        }
        catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).send({
                message: "Error fetching the users",
            });
        }
    }),
};
exports.default = chatController;
//# sourceMappingURL=chat.js.map