import { type Request, type Response } from "express";
import User from "../models/userModel.js";
import Book from "../models/bookModel.js";
import Author from "../models/authorModel.js";
import Comment from "../models/commentModel.js";
import Review from "../models/reviewModel.js";
import { hashPassword, verifyPassword } from "../services/authServices.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";

declare global {
  namespace Express {
    interface Request {
      auth?: { id: string; role: string };
    }
  }
}

export const changePassword = async (
  req: Request<{}, {}, { oldPassword?: string; newPassword?: string }>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.auth?.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ message: "Old and new password are required" });
      return;
    }

    if (oldPassword === newPassword) {
      res
        .status(400)
        .json({ message: "New password must be different from old password" });
      return;
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await verifyPassword(oldPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Old password is incorrect" });
      return;
    }

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("changePassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateComment = async (
  req: Request<{ commentId: string }, {}, { content?: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const userId = req.auth?.id;
    const { content } = req.body;

    if (!content || typeof content !== "string") {
      res.status(400).json({ message: "Content is required" });
      return;
    }

    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, user: userId },
      { content },
      { new: true, runValidators: true },
    );

    if (!comment) {
      res
        .status(404)
        .json({ message: "Comment not found or you are not the owner" });
      return;
    }

    res.json({ message: "Comment updated", comment });
  } catch (error) {
    console.error("updateComment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteComment = async (
  req: Request<{ commentId: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const userId = req.auth?.id;

    const comment = await Comment.findOneAndDelete({
      _id: commentId,
      user: userId,
    });
    if (!comment) {
      res
        .status(404)
        .json({ message: "Comment not found or you are not the owner" });
      return;
    }

    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("deleteComment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.auth?.id;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const user = await User.findById(userId)
      .select("username email avatar bio role")
      .lean();

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("getCurrentUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReview = async (
  req: Request<{ reviewId: string }, {}, { rating?: number }>,
  res: Response,
): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const userId = req.auth?.id;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ message: "Rating must be between 1 and 5" });
      return;
    }

    const review = await Review.findOneAndUpdate(
      { _id: reviewId, userId },
      { rating },
      { new: true, runValidators: true },
    );

    if (!review) {
      res
        .status(404)
        .json({ message: "Review not found or you are not the owner" });
      return;
    }

    res.json({ message: "Review updated", review });
  } catch (error) {
    console.error("updateReview error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReview = async (
  req: Request<{ reviewId: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const userId = req.auth?.id;

    const review = await Review.findOneAndDelete({ _id: reviewId, userId });
    if (!review) {
      res
        .status(404)
        .json({ message: "Review not found or you are not the owner" });
      return;
    }

    res.json({ message: "Review deleted" });
  } catch (error) {
    console.error("deleteReview error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const listCommentsByAuthor = async (
  req: Request<{ authorId: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { authorId } = req.params;
    const comments = await Comment.find({
      targetType: "Author",
      targetId: authorId,
    })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ comments });
  } catch (error) {
    console.error("Error in listing author comments", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const listCommentsByBook = async (
  req: Request<{ bookId: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { bookId } = req.params;
    const comments = await Comment.find({
      targetType: "Book",
      targetId: bookId,
    })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ comments });
  } catch (error) {
    console.error("Error in listing book comments", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createComment = async (
  req: Request<
    {},
    {},
    { content: string; targetType: "Book" | "Author"; targetId: string }
  >,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.auth?.id;
    const { content, targetType, targetId } = req.body;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    if (!content || !targetType || !targetId) {
      res.status(400).json({ message: "One or multiple fields missing" });
      return;
    }
    if (targetType === "Book") {
      const book = await Book.findById(targetId);
      if (!book) {
        res.status(404).json({ message: "Book not found" });
        return;
      }
    } else if (targetType === "Author") {
      const author = await Author.findById(targetId);
      if (!author) {
        res.status(404).json({ message: "Author not found" });
        return;
      }
    } else {
      res.status(400).json({ message: "Invalid TargetType" });
      return;
    }
    const comment = new Comment({
      content,
      user: userId,
      targetType,
      targetId,
    });
    await comment.save();
    res.status(201).json({
      message: "Comment created",
      comment,
    });
  } catch (error) {
    console.error("Error in creating a comment", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const listReviewsByBook = async (
  req: Request<{ bookId: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.find({ bookId })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 })
      .lean();

    const average =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
      reviews,
      averageRating: average,
      count: reviews.length,
    });
  } catch (error) {
    console.error("Error in listing reviews", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createReview = async (
  req: Request<{ bookId: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { bookId } = req.params;
    const userId = req.auth?.id;
    const { rating } = req.body;

    if (!userId) {
      res.status(401).json({ message: "No authentication" });
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({
        message:
          "Error in adding review either is less than 1 or more than 5 or you forgot it",
      });
      return;
    }

    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    const review = await Review.findOneAndUpdate(
      { userId, bookId },
      { rating },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
    res.status(201).json({ message: "Review saved", review });
  } catch (error) {
    console.error("Error in creating a review", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = req.query.q as string | undefined;
    if (!q) {
      res.status(400).json({ message: "Search query is required" });
      return;
    }

    const [books, authors] = await Promise.all([
      Book.find({ title: { $regex: q, $options: "i" } })
        .populate("author", "name surname")
        .limit(10)
        .lean(),
      Author.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { surname: { $regex: q, $options: "i" } },
        ],
      })
        .limit(10)
        .lean(),
    ]);

    res.json({ books, authors });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAuthors = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const skip = (page - 1) * limit;

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

export const getAllBooks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const skip = (page - 1) * limit;

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

export const getAuthorInfosById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const author = await Author.findById(id).lean();
    if (!author) {
      res.status(404).json({ message: "Author not found" });
      return;
    }

    const books = await Book.find({ author: id }).select("title cover").lean();

    res.json({ author, books });
  } catch (error) {
    console.error("getAuthor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBooksInfosById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id)
      .populate("author", "name surname")
      .lean();

    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    // Get average rating and review count
    const stats = await Review.aggregate([
      { $match: { bookId: book._id } },
      {
        $group: {
          _id: "$bookId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    res.json({
      ...book,
      averageRating: stats.length > 0 ? stats[0].averageRating : 0,
      reviewCount: stats.length > 0 ? stats[0].reviewCount : 0,
    });
  } catch (error) {
    console.error("getBook error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const showUserInfos = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select("username email avatar bio")
      .lean();
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("showUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editUserInfos = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.auth?.id;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const { bio } = req.body;
    const updateData: { bio?: string; avatar?: string } = {};

    if (bio !== undefined) {
      updateData.bio = bio;
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "avatars");
      updateData.avatar = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("editUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
