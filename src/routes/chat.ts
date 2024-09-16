import { Router } from "express";
import chatController from "../controller/chat";

const chatRouter = Router();

chatRouter.get('/get/all/user',chatController.totalUsers)
chatRouter.get('/get/all/chat/:id',chatController.fetchIndividualUserMessages)
chatRouter.patch('/update/status/:id',chatController.updateUserStatus)

export default chatRouter;