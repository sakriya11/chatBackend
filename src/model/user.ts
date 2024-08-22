import { Schema, Document, model } from "mongoose";

const userSchema = new Schema(
  {
    fullname: String,
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
    },
    password: String,
    confirmpassword: String,
    active:{type:Boolean,default:false},
   
    emailVerified: {
      type: Boolean,
      default: false,
    },
    // role:{
    //   type:String,
    //   enum:["user","admin"],
    //   default:"user"
    // }
  },
  { timestamps: true }
);

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  confirmpassword: string;
  active:boolean;
  emailVerified:boolean;
//   role:string;
}

const User = model<IUser>("User", userSchema);

export default User;
