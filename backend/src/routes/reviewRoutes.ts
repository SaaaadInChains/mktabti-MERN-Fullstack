import { Router } from "express";
import {
  createReview,
  listReviewsByBook,
  updateReview,
  deleteReview
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { reviewValidation } from "../validators/reviewValidator.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post(
  "/books/:bookId/reviews",
  authenticate,
  reviewValidation,
  validate,
  createReview,
);
router.get("/books/:bookId/reviews", listReviewsByBook);
router.put("/reviews/:reviewId", authenticate, updateReview);
router.delete("/reviews/:reviewId", authenticate, deleteReview);

export default router;
