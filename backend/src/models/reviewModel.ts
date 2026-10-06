import * as mongoose from "mongoose";
import { type InferSchemaType, Model, Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
      default: 0,
      max: 5,
      min: 1,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

type ReviewSchemaType = InferSchemaType<typeof reviewSchema>;

const Review: Model<ReviewSchemaType> = mongoose.model<ReviewSchemaType>(
  "Review",
  reviewSchema,
);
export default Review;
