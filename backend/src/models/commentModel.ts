import * as mongoose from "mongoose";
import { type InferSchemaType, Schema, Model } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["Author", "Book"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targettype",
    },
  },
  { timestamps: true },
);

type CommentSchemaType = InferSchemaType<typeof commentSchema>;

const Comment: Model<CommentSchemaType> = mongoose.model<CommentSchemaType>(
  "Comment",
  commentSchema,
);
export default Comment;
