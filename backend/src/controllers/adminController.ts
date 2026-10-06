import { type Request, type Response } from "express";
import User from "../models/userModel.js";
import Book from "../models/bookModel.js";
import Author from "../models/authorModel.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";

const getPagination = (req: Request) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const deleteBook = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.json({ message: "Book deleted" });
  } catch (error) {
    console.error("deleteBook error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAuthor = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const author = await Author.findByIdAndDelete(id);
    if (!author) {
      res.status(404).json({ message: "Author not found" });
      return;
    }
    res.json({ message: "Author deleted" });
  } catch (error) {
    console.error("deleteAuthor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editAuthor = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Author ID required" });
      return;
    }

    const updateData: {
      name?: string;
      surname?: string;
      movement?: string;
      nationality?: string;
      placeOfBirth?: string;
      dateOfBirth?: Date;
      dateOfDeath?: Date | null;
      biography?: string;
      picture?: string;
    } = {};

    const {
      name,
      surname,
      movement,
      nationality,
      placeOfBirth,
      dateOfBirth,
      dateOfDeath,
      biography,
    } = req.body;

    if (name !== undefined) updateData.name = name;
    if (surname !== undefined) updateData.surname = surname;
    if (movement !== undefined) updateData.movement = movement;
    if (nationality !== undefined) updateData.nationality = nationality;
    if (placeOfBirth !== undefined) updateData.placeOfBirth = placeOfBirth;
    if (dateOfBirth !== undefined)
      updateData.dateOfBirth = new Date(dateOfBirth);
    if (dateOfDeath !== undefined) {
      updateData.dateOfDeath =
        dateOfDeath === "null" || dateOfDeath === ""
          ? null
          : new Date(dateOfDeath);
    }
    if (biography !== undefined) updateData.biography = biography;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "pictures");
      updateData.picture = result.secure_url;
    }

    const updatedAuthor = await Author.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAuthor) {
      res.status(404).json({ message: "Author not found" });
      return;
    }

    res.json({
      message: "Author updated",
      author: updatedAuthor,
    });
  } catch (error) {
    console.error("Error in editing author", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editBook = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Book ID required" });
      return;
    }

    const updateData: {
      title?: string;
      numberOfPages?: number;
      genre?: string;
      summary?: string;
      author?: string;
      cover?: string;
    } = {};

    const { title, numberOfPages, genre, summary, author } = req.body;

    if (title !== undefined) updateData.title = title;
    if (numberOfPages !== undefined) updateData.numberOfPages = numberOfPages;
    if (genre !== undefined) updateData.genre = genre;
    if (summary !== undefined) updateData.summary = summary;

    if (author !== undefined) {
      const authorExists = await Author.findById(author);
      if (!authorExists) {
        res.status(404).json({ message: "Author not found" });
        return;
      }
      updateData.author = author;
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "covers");
      updateData.cover = result.secure_url;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("author", "name surname");

    if (!updatedBook) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    res.json({
      message: "Book updated",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error in editing book: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editUserRole = async (
  req: Request<{ id: string }, {}, { role?: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["user", "worker", "admin"];
    if (!role || !allowedRoles.includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "User role updated", user });
  } catch (error) {
    console.error("editUserRole error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { page, limit, skip } = getPagination(req);

    const [users, total] = await Promise.all([
      User.find()
        .select("username email role avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(),
    ]);

    res.json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, numberOfPages, genre, summary, author } = req.body;

    if (!title || !numberOfPages || !genre || !summary || !author) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const authorExists = await Author.findById(author);
    if (!authorExists) {
      res.status(404).json({ message: "Author not found" });
      return;
    }

    let cover = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "covers");
      cover = result.secure_url;
    }

    const book = new Book({
      title,
      numberOfPages,
      genre,
      summary,
      author,
      cover,
    });

    await book.save();

    res.status(201).json({
      message: "Book created",
      book,
    });
  } catch (error) {
    console.error("createBook error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAuthor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      name,
      surname,
      movement,
      nationality,
      placeOfBirth,
      dateOfBirth,
      dateOfDeath,
      biography,
    } = req.body;

    // Remove dateOfDeath from required validation
    if (
      !name ||
      !surname ||
      !movement ||
      !nationality ||
      !placeOfBirth ||
      !dateOfBirth ||
      !biography
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    let picture = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "authors");
      picture = result.secure_url;
    }

    const author = new Author({
      name,
      surname,
      movement,
      nationality,
      placeOfBirth,
      dateOfBirth,
      dateOfDeath: dateOfDeath || null,
      biography,
      picture,
    });

    await author.save();

    res.status(201).json({
      message: "Author created",
      author,
    });
  } catch (error) {
    console.error("createAuthor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBooks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [books, total] = await Promise.all([
      Book.find()
        .populate("author", "name surname")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Book.countDocuments(),
    ]);
    res.json({
      books,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("getAllBooks error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAuthors = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [authors, total] = await Promise.all([
      Author.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Author.countDocuments(),
    ]);
    res.json({
      authors,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("getAllAuthors error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
