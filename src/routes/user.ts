import authController from "../controller/user";
import { Router } from "express";

const userRouter = Router();

userRouter
  .post("/create/user", authController.userRegistration)
  .post("/login", authController.login)
  .post("/user/email/verification", authController.emailVerification)

export default userRouter;
