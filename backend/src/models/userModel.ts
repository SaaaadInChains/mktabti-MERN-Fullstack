import {type InferSchemaType, Schema, Model } from "mongoose";
import * as mongoose from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "worker", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

type UserSchemaType = InferSchemaType<typeof userSchema>;

const User: Model<UserSchemaType> = mongoose.model<UserSchemaType>(
  "User",
  userSchema,
);
export default User;
