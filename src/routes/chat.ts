import { Router } from "express";
import chatController from "../controller/chat";

const chatRouter = Router();

chatRouter
  .get("/get/all/user", chatController.totalUsers)
  .get("/get/all/chat/:id", chatController.fetchIndividualUserMessages)
  .patch("/update/status/:id", chatController.updateUserStatus)
  .delete("/delete/:id", chatController.deleteSingleChat)
  .get("/get/roomid", chatController.generateuserId);

export default chatRouter;
