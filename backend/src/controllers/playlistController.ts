import { type Request, type Response } from "express";
import Playlist from "../models/playlistModel.js";
import Book from "../models/bookModel.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";

const parseBooks = (books: any): string[] | null => {
  if (Array.isArray(books)) return books;
  if (typeof books === "string") {
    try {
      return JSON.parse(books);
    } catch {
      return null;
    }
  }
  return null;
};

export const createPlaylist = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.auth?.id;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const { name, books } = req.body;
    if (!name || typeof name !== "string") {
      res.status(400).json({ message: "Playlist name is required" });
      return;
    }

    let booksArray: string[] = [];
    if (books !== undefined) {
      const parsed = parseBooks(books);
      if (parsed === null) {
        res.status(400).json({ message: "Invalid books format" });
        return;
      }
      booksArray = parsed;
    }

    if (booksArray.length > 0) {
      const validBooks = await Book.find({ _id: { $in: booksArray } }).select(
        "_id",
      );
      if (validBooks.length !== booksArray.length) {
        res.status(404).json({ message: "One or more books not found" });
        return;
      }
    }

    let cover = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "playlists");
      cover = result.secure_url;
    }

    const playlist = new Playlist({
      name,
      owner: userId,
      books: booksArray,
      cover,
    });

    await playlist.save();

    res.status(201).json({
      message: "Playlist created",
      playlist,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res
        .status(409)
        .json({ message: "You already have a playlist with that name" });
      return;
    }
    console.error("createPlaylist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyPlaylists = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.auth?.id;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const playlists = await Playlist.find({ owner: userId })
      .populate("books", "title cover author")
      .lean();

    res.json({ playlists });
  } catch (error) {
    console.error("getMyPlaylists error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlaylistById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.auth?.id;
    const { id } = req.params;

    const playlist = await Playlist.findOne({ _id: id, owner: userId })
      .populate("books", "title cover author")
      .lean();

    if (!playlist) {
      res.status(404).json({ message: "Playlist not found" });
      return;
    }

    res.json({ playlist });
  } catch (error) {
    console.error("getPlaylistById error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePlaylist = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.auth?.id;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const updateData: { name?: string; books?: string[]; cover?: string } = {};
    const { name, books } = req.body;

    if (name !== undefined) updateData.name = name;

    if (books !== undefined) {
      const parsed = parseBooks(books);
      if (parsed === null) {
        res.status(400).json({ message: "Invalid books format" });
        return;
      }
      if (parsed.length > 0) {
        const validBooks = await Book.find({ _id: { $in: parsed } }).select(
          "_id",
        );
        if (validBooks.length !== parsed.length) {
          res.status(404).json({ message: "One or more books not found" });
          return;
        }
      }
      updateData.books = parsed;
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "playlists");
      updateData.cover = result.secure_url;
    }

    const playlist = await Playlist.findOneAndUpdate(
      { _id: id, owner: userId },
      updateData,
      { returnDocument: "after", runValidators: true },
    ).populate("books", "title cover author");

    if (!playlist) {
      res
        .status(404)
        .json({ message: "Playlist not found or you are not the owner" });
      return;
    }

    res.json({ message: "Playlist updated", playlist });
  } catch (error: any) {
    if (error.code === 11000) {
      res
        .status(409)
        .json({ message: "You already have a playlist with that name" });
      return;
    }
    console.error("updatePlaylist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePlaylist = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.auth?.id;
    const { id } = req.params;

    const playlist = await Playlist.findOneAndDelete({
      _id: id,
      owner: userId,
    });
    if (!playlist) {
      res
        .status(404)
        .json({ message: "Playlist not found or you are not the owner" });
      return;
    }

    res.json({ message: "Playlist deleted" });
  } catch (error) {
    console.error("deletePlaylist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
