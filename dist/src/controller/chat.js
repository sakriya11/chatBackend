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
const chat_1 = __importDefault(require("../model/chat"));
const chatController = {
    totalUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const totalUsers = yield user_1.default.find();
            if (totalUsers) {
                const userList = [];
                totalUsers.forEach((data) => {
                    const trimedData = {
                        name: data.fullname,
                        id: data.id,
                        status: data.active,
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
    fetchIndividualUserMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const selectedUserId = req.params.id;
            const user = req.user;
            if (user) {
                const data = yield chat_1.default.find({
                    $or: [
                        { $and: [{ senderId: user._id }, { receiverId: selectedUserId }] },
                        { $and: [{ senderId: selectedUserId }, { receiverId: user._id }] },
                    ],
                });
                if (data.length > 0) {
                    return res.status(200).send({
                        data: data,
                    });
                }
                else {
                    return res.status(404).send({
                        message: "No conversation stored yet",
                    });
                }
            }
            else {
                return res.status(404).send({
                    message: "User not found",
                });
            }
        }
        catch (error) {
            console.log("error", error);
            return res.status(500).send({
                message: "Error fetching previous messages",
            });
        }
    }),
    updateUserStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield user_1.default.findByIdAndUpdate({
                _id: id,
            }, {
                active: false,
            });
            return;
        }
        catch (error) {
            console.log(error);
        }
    }),
};
exports.default = chatController;
//# sourceMappingURL=chat.js.map