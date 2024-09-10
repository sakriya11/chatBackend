import { NextFunction } from "express";
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import config from "../config";
import Chat from "../model/chat";
import allowOrigin from "../config/index";

const userSocketId = new Map<string, string>();
const allowedOrigin = allowOrigin.app.allowedOrigin;

export const socketMiddleware = (socket: Socket, next: NextFunction) => {
  try {
    const token = socket.handshake.auth.token as string;

    if (!token) {
      return next(new Error("socket auth error"));
    }
    const tokenVerification = jwt.verify(token, config.jwt.secret);
    socket.data.user = tokenVerification;
    if (tokenVerification) {
      console.log("socket user details", socket.data.user);
      next();
    }
  } catch (error) {
    console.log("socket middleware error", error);
  }
};

export const storingUserSocketId = (socketId: string, userId: string) => {
  try {
    userSocketId.set(userId, socketId);
    console.log("user stored ids", userSocketId);
  } catch (error) {
    console.log(error);
  }
};

export const getUserSocketIdFromUserId = (userId: string) => {
  try {
    console.log("storedid", userSocketId);
    return userSocketId.get(userId);
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserSocketId = (userId: string) => {
  try {
    userSocketId.delete(userId);
    console.log(`user ${userId} disconnected`);
  } catch (error) {
    console.log("error deleting user socket id", error);
  }
};

export const sendingMsg = (socket: Socket, msg: string, receiverId: string) => {
  try {
    const userId: string = receiverId;
    console.log("receiver id ", userId);
    const userSocketId = getUserSocketIdFromUserId(userId);
    console.log("receiver socketid", userSocketId);

    if (userSocketId) {
      console.log("socket id to receive  the mesages", msg);
      socket.to(userSocketId).emit("receivemsg", {
        msg,
      });
    } else {
      console.log(`${userSocketId} is not active`);
    }
  } catch (error) {
    console.log(error);
  }
};

export const saveMessages = async (
  senderId: string,
  receiverId: string,
  message: string,
) => {
  try {
    await Chat.create({
      senderId: senderId,
      receiverId: receiverId,
      msg: message,
    });
  } catch (error) {
    console.log("error storing the messages");
  }
};

export const socketCorsMiddleware = async (
  socket: Socket,
  next: NextFunction
) => {
  try {
    const origin = socket.handshake.headers.host;
    console.log(origin);
    console.log(allowedOrigin);
    if (origin && allowedOrigin.includes(origin)) {
      next();
    } else {
      const err = new Error("CORS error: Origin not allowed");
      next(err); // Deny the connection
    }
  } catch (error) {
    console.log("socket cors error", error);
  }
};
