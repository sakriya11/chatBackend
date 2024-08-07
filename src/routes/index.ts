import  express from "express";

import userRouter from "./user";

const routes = express();


routes.use(userRouter);

export default routes;
