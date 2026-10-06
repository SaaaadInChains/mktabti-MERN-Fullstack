import * as mongoose from "mongoose";
import { type InferSchemaType, Schema, Model } from "mongoose";

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    cover: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

playlistSchema.index({ owner: 1, name: 1 }, { unique: true });

type PlaylistSchemaType = InferSchemaType<typeof playlistSchema>;

const Playlist: Model<PlaylistSchemaType> = mongoose.model<PlaylistSchemaType>(
  "Playlist",
  playlistSchema,
);
export default Playlist;
