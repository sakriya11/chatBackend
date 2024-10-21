import { Document, Schema, model } from "mongoose";
import { IUser } from "./user";

const chatSchema = new Schema(
  {
    msg: String,
    senderId: { type: Schema.Types.ObjectId, ref: "IUser"},
    receiverId: { type: Schema.Types.ObjectId, ref: "IUser"},
    conversationId: String,
    isRead: Boolean,
    isDelivered: Boolean,
    image:String
    // messageType: String;
    // attachments?: String
    // status?: String;
    // reaction?: String;
    // edited?: boolean;
    // deleted?: boolean;
    // replyTo?: String;
    // forwarded?: boolean;
  },
  { timestamps: true }
);

export interface IChat extends Document {
  msg?: string;
  senderId: IUser["_id"];
  receiverId: IUser["_id"];
  conversationId?: string;
  isRead: boolean;
  isDelivered: boolean;
  image?:string;
}

const Chat = model<IChat>("Chat", chatSchema);

export default Chat;
