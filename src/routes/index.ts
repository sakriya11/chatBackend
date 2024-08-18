import  express from "express";

import userRouter from "./user";
import chatRouter from "./chat";

const routes = express();


routes.use(userRouter);
routes.use(chatRouter);

export default routes;
