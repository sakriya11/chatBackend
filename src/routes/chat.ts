import { Router } from "express";
import chatController from "../controller/chat";

const chatRouter = Router();

chatRouter.get('/get/all/user',chatController.totalUsers);

export default chatRouter;