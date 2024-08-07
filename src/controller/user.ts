import { Request, Response } from "express";
import User from "../model/user";
import bcrypt from "bcryptjs";
// import { Key } from "../models/key";
import { randomBytes } from "crypto";
// import { genRandomNumber } from "../helper/generator";
import jwt from "jsonwebtoken";
import config from "../config";
// import {  socketTokenValidation } from "../config/socket/socketConnection";

const authController = {
  registration: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, email, password } = req.body;

      const ifEmailExist = await User.findOne({ email: email });

      if (!ifEmailExist) {
        return res.status(409).send({
          message: "The given email is already taken use another",
        });
      }

      const registerUser = await User.create({
        name: name,
        email: email,
        password: bcrypt.hashSync(password),
      });

      //   const _token = await Key.create({
      //     userId: registerUser.id,
      //     key: randomBytes(32).toString("hex"),
      //     token: genRandomNumber().toString(),
      //   });

      return res.status(200).send({
        message: "User registered succesfully",
        data: registerUser,
        // key: _token.key,
      });
    } catch (error) {
      console.log(error);
    }
  },
  login: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).send({
          message: "User does not exist please register",
        });
      }
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(409).send({
          message: "Incorrect password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
        },
        config.jwt.secret,
        {
          expiresIn: config.jwt.token_ttl,
          issuer: config.jwt.issuer,
        }
      );
      const resUser = user.toJSON();
      delete resUser.password;

      return res.status(200).send({
        message: "Logged in succesfully",
        accessToken: token,
        user: resUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "An error occurred during login.",
      });
    }
  },
};

export default authController;
