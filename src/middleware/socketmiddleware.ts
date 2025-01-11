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

export const sendingMsg = (
  socket: Socket,
  msg: string,
  receiverId: string,
  image: string
) => {
  try {
    const userId: string = receiverId;
    const userSocketId = getUserSocketIdFromUserId(userId);

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
  message?: string,
  image?: string
) => {
  try {
    await Chat.create({
      senderId: senderId,
      receiverId: receiverId,
      msg: message,
      image: image,
    });
  } catch (error) {
    console.log("error storing the messages");
  }
};

export const joinVideoChatRoom = (
  socket: Socket,
  roomId: string
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
  } catch (error) {
    console.log("error coonecting user to room", error);
  }
};

export const sendCallRequest = (
  userId: string,
  roomId: string,
  callerName: string,
  socket: Socket
) => {
  try {
    const socketId = getUserSocketIdFromUserId(userId);
    if (socketId) {
      socket.to(socketId).emit("incommingcall", {
        callerName: callerName,
        roomid: roomId,
      });
    } else {
      console.log("user trying to call is not connected");
    }
  } catch (error) {
    console.log(error);
  }
};
