import * as mongoose from "mongoose";
import { type InferSchemaType, Schema, Model } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    numberOfPages: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "No summary yet...",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

type bookSchemaType = InferSchemaType<typeof bookSchema>;

const Book: Model<bookSchemaType> = mongoose.model<bookSchemaType>(
  "Book",
  bookSchema,
);
export default Book;
