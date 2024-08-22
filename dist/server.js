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
        origin: "http://localhost:3000", // The frontend address
        methods: ["GET", "POST"], // Allowable methods
        credentials: true,
    },
});
io.use(socketmiddleware_1.socketCorsMiddleware);
app.use((0, cors_1.default)());
//token authentication for socket connection
io.use(socketmiddleware_1.socketMiddleware);
//socket connection
io.on("connection", (socket) => {
    console.log("user active", socket.id);
    const userId = socket.data.user.id;
    const socketId = socket.id;
    (0, socketmiddleware_1.storingUserSocketId)(socketId, userId);
    //msg sending event
    socket.on("sendmsg", (data) => {
        (0, socketmiddleware_1.sendingMsg)(socket, data);
        const receiverId = socket.handshake.query.userId;
        //storring coversation to db
        (0, socketmiddleware_1.saveMessages)(userId, receiverId, data.msg);
    });
    socket.on("disconnect", () => {
        (0, socketmiddleware_1.deleteUserSocketId)(userId);
    });
});
// server.use(helmet()); //for security
app.use(express_1.default.json());
app.use("/api", routes_1.default);
// /db connection
db_1.default.on("error", console.error.bind(console, "MongoDB connection errorrr:"));
db_1.default.on("close", function () {
    console.log("DB connection is close");
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