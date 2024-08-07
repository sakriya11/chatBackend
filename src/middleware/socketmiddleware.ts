import { NextFunction } from "express";
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import config from "../config";
import Chat from "../model/chat";

const userSocketId = new Map<string, string>();

export const socketMiddleware = (socket: Socket, next: NextFunction) => {
  try {
    const token = socket.handshake.query.token as string;
    if (!token) {
      return next(new Error("socket auth error"));
    }
    const tokenVerification = jwt.verify(token, config.jwt.secret);
    socket.data.user = tokenVerification;

    console.log("socket user details", socket.data.user);
    next();
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

export const sendingMsg = (socket: Socket, msg: string) => {
  try {
    const userId = socket.handshake.query.userId as string;
    const userSocketId = getUserSocketIdFromUserId(userId);
    if (userSocketId) {
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
  message: string
) => {
  try {
    await Chat.create({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
    });
  } catch (error) {
    console.log("error storing the messages");
  }
};
