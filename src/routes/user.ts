import authController from "../controller/user";
import { Router } from "express";

const userRouter = Router();

userRouter
.post("/create/user",authController.registration)
.post("/login",authController.login);

export default userRouter;