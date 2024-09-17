import { Request, Response } from "express";
import User from "../model/user";
import { IReqUser } from "../middleware/auth";
import Chat from "../model/chat";

interface responseData {
  id: string;
  name: string;
}

const chatController = {
  totalUsers: async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as IReqUser).user;
      const totalUsers = await User.find();
      const filteredUser = totalUsers.filter(
        (item) => item._id.toString() !== userId._id.toString()
      );
      if (filteredUser) {
        const userList: responseData[] = [];

        filteredUser.forEach((data) => {
          const trimedData = {
            name: data.fullname,
            id: data.id,
            status: data.active,
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
            { $and: [{ senderId: selectedUserId }, { receiverId: user._id }] },
          ],
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

  updateUserStatus: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          active: false,
        }
      );
      return res.status(200).send({
        message: "status updated",
      });
    } catch (error) {
      console.log(error);
    }
  },

  deleteSingleChat: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await Chat.findByIdAndDelete({
        _id: id,
      });
      return;
    } catch (error) {
      console.log(error);
    }
  },
};

export default chatController;
