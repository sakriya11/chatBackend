import  express from "express";
import userRouter from "./user";
import chatRouter from "./chat";
import authMiddleware from "../middleware/auth";


const routes = express();


routes.use(userRouter);
routes.use(authMiddleware.verifyToken,chatRouter);

export default routes;
