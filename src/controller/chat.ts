import { Request, Response } from "express";
import User, { IUser } from "../model/user";
import { IReqUser } from "../middleware/auth";
import Chat from "../model/chat";

interface responseData {
  id: string;
  name: string;
}

const chatController = {
  totalUsers: async (req: Request, res: Response): Promise<Response> => {
    try {
      const totalUsers = await User.find();
      if (totalUsers) {
        const userList: responseData[] = [];

        totalUsers.forEach((data) => {
          const trimedData = {
            name: data.fullname,
            id: data.id,
          };
          userList.push(trimedData);
        });

        return res.status(200).send({
          data: userList,
        });
      } else {
        return res.status(404).send({
          message: "No users found",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).send({
        message: "Error fetching the users",
      });
    }
  },

  fetchIndividualUserMessages: async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const selectedUserId: string = req.params.id;
      const user = (req as IReqUser).user;
      if (user) {
        const data = await Chat.find({
          $or: [
            { $and: [{ senderId: user._id }, { receiverId: selectedUserId }] },
            { $and: [{ senderId: selectedUserId }, { receiverId: user._id }] }
          ]
        });
        if (data.length > 0) {
          return res.status(200).send({
            data: data,
          });
        } else {
          return res.status(404).send({
            message: "No conversation stored yet",
          });
        }
      } else {
        return res.status(404).send({
          message: "User not found",
        });
      }
    } catch (error) {
      console.log("error", error);

      return res.status(500).send({
        message: "Error fetching previous messages",
      });
    }
  },
};

export default chatController;
