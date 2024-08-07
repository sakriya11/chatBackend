import { model, Document, Schema } from "mongoose";
import { IUser } from "./user";

const tokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "IUser" },
    token: { type: Number },
  },
  { timestamps: true }
);

export interface IToken extends Document {
  user: IUser["_id"];
  token: number;
}

const token = model<IToken>("token", tokenSchema);

export default token;
