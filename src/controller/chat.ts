import { Request, Response } from "express";
import User from "../model/user";

interface responseData {
  id: string;
  name: string;
}

const chatController = {
  totalUsers: async (req: Request, res: Response): Promise<Response> => {
    try {
      console.log("origin",req.headers.origin);
      const userToken = req.header;
      console.log(userToken);

      const totalUsers = (await User.find());
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
};

export default chatController;
