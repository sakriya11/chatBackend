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
  // socketCorsMiddleware,
} from "./middleware/socketmiddleware";
import cors from "cors";

const app = Express();

const originRegex = new RegExp(config.app.originRegex);
// CORS for Express routes
// const corsOption = {
//   credentials: true,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   origin: function (origin: string, callback: any) {
//     if (!origin) {
//       callback(null, true);
//       return;
//     }
//     if (config.app.allowedOrigin.indexOf(origin) !== -1 || originRegex.test(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };
const httpServer = createServer(app);

const io = new Server(httpServer,
  {
  cors: {
    origin:config.app.allowedOrigin,
    methods:["POST","GET"]
  }
}
);

// app.use(cors());


app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
//  io.use(socketCorsMiddleware);

// Middleware for socket connections
io.use(socketMiddleware);

// Handle socket connections
io.on("connection", (socket) => {
  console.log('Origin:', socket.handshake.headers.origin);
  console.log("user active", socket.id);
  const userId = socket.data.user.id;
  const socketId = socket.id;
  storingUserSocketId(socketId, userId);

  // Handle message sending
  socket.on("sendmsg", (data) => {
    sendingMsg(socket, data);
    const receiverId = socket.handshake.query.userId as string;
    saveMessages(userId, receiverId, data.msg);
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
