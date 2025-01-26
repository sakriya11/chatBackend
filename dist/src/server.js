"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../src/config/index"));
const http_1 = require("http");
const db_1 = __importDefault(require("../src/config/db/db"));
const routes_1 = __importDefault(require("./routes"));
const socket_io_1 = require("socket.io");
const socketmiddleware_1 = require("./middleware/socketmiddleware");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        // origin: config.app.allowedOrigin,
        origin: ["https://chatfrontend-icbn.vercel.app"],
        methods: ["POST", "GET", "PATCH"],
    },
});
// app.use(cors());
app.use((0, cors_1.default)({
    // origin: config.app.allowedOrigin,
    origin: ["https://chatfrontend-icbn.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
//  io.use(socketCorsMiddleware);
// Middleware for socket connections
io.use(socketmiddleware_1.socketMiddleware);
// Handle socket connections
io.on("connection", (socket) => {
    socket.on("call-request", ({ userId, roomId, callerName }) => {
        (0, socketmiddleware_1.sendCallRequest)(userId, roomId, callerName, socket);
    });
    //starting video chat
    socket.on("call-accept", (roomId) => {
        (0, socketmiddleware_1.joinVideoChatRoom)(socket, roomId);
    });
    socket.on("videochat-started", (roomId) => {
        (0, socketmiddleware_1.joinVideoChatRoom)(socket, roomId);
    });
    const userId = socket.data.user.id;
    if (!userId) {
        console.error("User ID is missing in socket connection");
        return;
    }
    const socketId = socket.id;
    (0, socketmiddleware_1.storingUserSocketId)(socketId, userId);
    // Handle message sending
    socket.on("sendmsg", (data) => {
        const receiverId = data.receiverId;
        (0, socketmiddleware_1.sendingMsg)(socket, data.msg, receiverId, data.image);
        (0, socketmiddleware_1.saveMessages)(userId, receiverId, data === null || data === void 0 ? void 0 : data.msg, data === null || data === void 0 ? void 0 : data.image);
    });
    // Handle disconnection
    socket.on("disconnect", () => {
        (0, socketmiddleware_1.deleteUserSocketId)(userId);
    });
});
// Additional Express configuration
app.use(express_1.default.json());
app.use("/api", routes_1.default);
// Database connection
db_1.default.on("error", console.error.bind(console, "MongoDB connection error:"));
db_1.default.on("close", function () {
    console.log("DB connection is closed");
});
db_1.default.once("open", function () {
    console.log("Connected to MongoDB database!!");
});
const port = index_1.default.app.port;
const host = index_1.default.app.host;
httpServer.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});
//# sourceMappingURL=server.js.map