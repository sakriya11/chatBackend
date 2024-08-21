import { Request, Response } from "express";
import User from "../model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import Token from '../model/token';
import { mailOption, sendEmail, transport } from "../services/emailverification";
import { genRandomNumber } from "../helper/generator";
// import {  socketTokenValidation } from "../config/socket/socketConnection";

const authController = {
  
  userRegistration: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { fullName, email, password, confirmPassword} = req.body;
      // console.log("request",req.body);
      const emailExist = await User.findOne({
        email: email,
      });
      if (emailExist) {
        return res.status(409).send({
          message: "Given email id already exist",
        });
      }
      if (password !== confirmPassword) {
        return res.status(409).send({
          message: "Password and confirm password did not match",
        });
      }

      const registerUser = await User.create({
        fullName,
        email,
        password: bcrypt.hashSync(password),
      });

      const emailVerificationToken = await Token.create({
        user: registerUser.id,
        token: genRandomNumber(),
      });
      const option = mailOption(
        registerUser.email,
        registerUser.fullName,
        emailVerificationToken.token
      );
      await sendEmail(option, transport);

      return res.status(200).send({
        message: "user registered succesfully",
      });
    } catch (error) {
      console.log("registration error", error);
      return res.status(500).send({
        message: "Registration error",
      });
    }
  },

  emailVerification: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { verificationCode } = req.body;
      const verifyCode = Number(verificationCode);

      const tokenExist = await Token.findOne({
        token: verifyCode,
      });

      if (tokenExist) {
        await User.findByIdAndUpdate(tokenExist.user, {
          emailVerified: true,
        });
        return res.status(200).send({
          message: "Email verified succesfully",
        });
      } else {
        return res.status(409).send({
          message:
            "Email verification failed please sign up and resend the verification code ",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "email not verified",
      });
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
