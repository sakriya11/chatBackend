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
exports.sendCallRequest = exports.joinVideoChatRoom = exports.saveMessages = exports.sendingMsg = exports.deleteUserSocketId = exports.getUserSocketIdFromUserId = exports.storingUserSocketId = exports.socketMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const chat_1 = __importDefault(require("../model/chat"));
const index_1 = __importDefault(require("../config/index"));
const userSocketId = new Map();
const allowedOrigin = index_1.default.app.allowedOrigin;
const socketMiddleware = (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("socket auth error"));
        }
        const tokenVerification = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        socket.data.user = tokenVerification;
        if (tokenVerification) {
            console.log("socket user details", socket.data.user);
            next();
        }
    }
    catch (error) {
        console.log("socket middleware error", error);
    }
};
exports.socketMiddleware = socketMiddleware;
const storingUserSocketId = (socketId, userId) => {
    try {
        userSocketId.set(userId, socketId);
        console.log("user stored ids", userSocketId);
    }
    catch (error) {
        console.log(error);
    }
};
exports.storingUserSocketId = storingUserSocketId;
const getUserSocketIdFromUserId = (userId) => {
    try {
        console.log("storedid", userSocketId);
        return userSocketId.get(userId);
    }
    catch (error) {
        console.log(error);
    }
};
exports.getUserSocketIdFromUserId = getUserSocketIdFromUserId;
const deleteUserSocketId = (userId) => {
    try {
        userSocketId.delete(userId);
        console.log(`user ${userId} disconnected`);
    }
    catch (error) {
        console.log("error deleting user socket id", error);
    }
};
exports.deleteUserSocketId = deleteUserSocketId;
const sendingMsg = (socket, msg, receiverId, image) => {
    try {
        const userId = receiverId;
        const userSocketId = (0, exports.getUserSocketIdFromUserId)(userId);
        if (userSocketId) {
            if (image) {
                socket.to(userSocketId).emit("receivemsg", {
                    image,
                });
            }
            // console.log("socket id to receive  the mesages", msg);
            if (msg) {
                socket.to(userSocketId).emit("receivemsg", {
                    msg,
                });
            }
        }
        else {
            console.log(`${userSocketId} is not active`);
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendingMsg = sendingMsg;
const saveMessages = (senderId, receiverId, message, image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chat_1.default.create({
            senderId: senderId,
            receiverId: receiverId,
            msg: message,
            image: image,
        });
    }
    catch (error) {
        console.log("error storing the messages");
    }
});
exports.saveMessages = saveMessages;
const joinVideoChatRoom = (socket, roomId
// peerId: string
) => {
    try {
        console.log("first user entered");
        socket.on("join-room", ({ roomId, peerId }) => {
            console.log("peerid", peerId);
            console.log("roomiddd", roomId);
            socket.join(roomId);
            socket.to(roomId).emit("user-connected", peerId);
            console.log(`${peerId} joined the room in ${roomId}`);
        });
        socket.on("leave-room", ({ roomId }) => {
            socket.leave(roomId);
            socket.to(roomId).emit("user-disconnected", socket.id);
            console.log(`User ${socket.id} left the room ${roomId}`);
        });
    }
    catch (error) {
        console.log("error coonecting user to room", error);
    }
};
exports.joinVideoChatRoom = joinVideoChatRoom;
const sendCallRequest = (userId, roomId, callerName, socket) => {
    try {
        const socketId = (0, exports.getUserSocketIdFromUserId)(userId);
        if (socketId) {
            socket.to(socketId).emit("incommingcall", {
                callerName: callerName,
                roomid: roomId,
            });
        }
        else {
            console.log("user trying to call is not connected");
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendCallRequest = sendCallRequest;
//# sourceMappingURL=socketmiddleware.js.map