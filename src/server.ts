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
  socketCorsMiddleware,
} from "./middleware/socketmiddleware";
import cors from 'cors';


const app = Express();
// CORS for Express routes
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (config.app.allowedOrigin.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allow cookies or credentials if needed
}));


const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin:"*", // The frontend address
    methods: ["GET", "POST"], // Allowable methods
    credentials: true, 
  },
});

// io.use(socketCorsMiddleware);

app.use(cors());

//token authentication for socket connection
io.use(socketMiddleware);

//socket connection
io.on("connection", (socket) => {
  console.log("user active", socket.id);
  const userId = socket.data.user.id;
  const socketId = socket.id;
  storingUserSocketId(socketId, userId);

  //msg sending event
  socket.on("sendmsg", (data) => {
    sendingMsg(socket, data);
    const receiverId = socket.handshake.query.userId as string;
    //storring coversation to db
    saveMessages(userId, receiverId, data.msg);
  });

  socket.on("disconnect", () => {
    deleteUserSocketId(userId);
  });
});

// server.use(helmet()); //for security
app.use(Express.json());
app.use("/api", routes);

// /db connection
db.on("error", console.error.bind(console, "MongoDB connection errorrr:"));
db.on("close", function () {
  console.log("DB connection is close");
});
db.once("open", function () {
  console.log("Connected to MongoDB database!!");
});

const port = config.app.port;
const host = config.app.host;

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});
