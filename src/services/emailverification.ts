import nodemailer from "nodemailer";
import config from "../config";

interface MailOption {
  from: string;
  to: string;
  subject: string;
  html: string;
}

interface Transport {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
  host: string;
  port: number;
  secure: boolean;
}

const transportConfig: Transport = {
  service: config.email.email_service,
  auth: {
    user: config.email.sender_email,
    pass: config.email.sender_email_pass,
  },
  host: config.email.host,
  port: config.email.port,
  secure: false,
};

export const transport = nodemailer.createTransport(transportConfig);

export const mailOption = (
  to: string,
  name: string,
  code: number
): MailOption => {
  return {
    from: config.email.sender_email,
    to: to,
    subject: "Email verification code",
    html: `Hello ${name} welcome to chat application. 
    Your registeration code is ${code}`,
  };
};

export const sendEmail = async (
  mailOption: MailOption,
  transport: any
): Promise<void> => {
  try {
    await transport.sendMail(mailOption);
    console.log("email sent");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
