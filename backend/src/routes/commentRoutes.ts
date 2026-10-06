import { Router } from "express";
import {
  listCommentsByAuthor,
  listCommentsByBook,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { commentValidation } from "../validators/commentValidator.js";

const router = Router();

router.post("/comments", authenticate, commentValidation, validate, createComment);
router.get("/books/:bookId/comments", listCommentsByBook);
router.get("/authors/:authorId/comments", listCommentsByAuthor);
router.put("/comments/:commentId", authenticate, updateComment);
router.delete("/comments/:commentId", authenticate, deleteComment);

export default router;