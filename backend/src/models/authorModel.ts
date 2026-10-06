import { type InferSchemaType, Schema, Model } from "mongoose";
import * as mongoose from "mongoose";

const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    movement: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    placeOfBirth: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    dateOfDeath: {
      type: Date,
      default: null,
    },
    biography: {
      type: String,
      default: "No biography yet...",
    },
    picture: {
      type: String,
    },
  },
  { timestamps: true },
);

type AuthorSchemaType = InferSchemaType<typeof authorSchema>;

const Author: Model<AuthorSchemaType> = mongoose.model<AuthorSchemaType>(
  "Author",
  authorSchema,
);
export default Author;
