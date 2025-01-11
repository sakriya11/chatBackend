import Express from "express";
import config from "../src/config/index";
import { createServer } from "http";
import db from "../src/config/db/db";
import routes from "./routes";
import { Server } from "socket.io";
import {
  storingUserSocketId,
  socketMiddleware,
  deleteUserSocketId,
  sendingMsg,
  saveMessages,
  joinVideoChatRoom,
  sendCallRequest,
} from "./middleware/socketmiddleware";
import cors from "cors";

const app = Express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    // origin: config.app.allowedOrigin,
    origin: ["https://chatfrontend-icbn.vercel.app","http://localhost:3000"],
    methods: ["POST", "GET", "PATCH"],
  },
});

// app.use(cors());

app.use(
  cors({
    origin: ["https://chatfrontend-icbn.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//  io.use(socketCorsMiddleware);

// Middleware for socket connections
io.use(socketMiddleware);

// Handle socket connections
io.on("connection", (socket) => {
  socket.on("call-request", ({ userId, roomId, callerName }) => {
    sendCallRequest(userId, roomId, callerName, socket);
  });

  //starting video chat
  socket.on("call-accept", (roomId) => {
    joinVideoChatRoom(socket, roomId);
  });

  socket.on("videochat-started", (roomId) => {
    joinVideoChatRoom(socket, roomId);
  });

  const userId = socket.data.user.id;
  if (!userId) {
    console.error("User ID is missing in socket connection");
    return;
  }

  const socketId = socket.id;
  storingUserSocketId(socketId, userId);

  // Handle message sending
  socket.on("sendmsg", (data) => {
    const receiverId = data.receiverId;
    sendingMsg(socket, data.msg, receiverId, data.image);
    saveMessages(userId, receiverId, data?.msg, data?.image);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    deleteUserSocketId(userId);
  });
});

// Additional Express configuration
app.use(Express.json());
app.use("/api", routes);

// Database connection
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("close", function () {
  console.log("DB connection is closed");
});
db.once("open", function () {
  console.log("Connected to MongoDB database!!");
});

const port = config.app.port;
const host = config.app.host;

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});
