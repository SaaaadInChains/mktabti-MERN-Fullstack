import { Router } from "express";
import {
  editUserRole,
  getAllUsers,
  createBook,
  createAuthor,
  editAuthor,
  editBook,
  getAllAuthors,
  getAllBooks,
  deleteAuthor,
  deleteBook,
} from "../controllers/adminController.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { imageUpload } from "../middleware/fileFilter.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/users", getAllUsers);
router.put("/users/:id/role", editUserRole);

router.post("/books", imageUpload.single("cover"), createBook);
router.put("/books/:id", imageUpload.single("cover"), editBook);
router.get("/books/", getAllBooks);
router.delete("/books/:id", deleteBook);

router.post("/authors", imageUpload.single("picture"), createAuthor);
router.put("/authors/:id", imageUpload.single("picture"), editAuthor);
router.get("/authors/", getAllAuthors);
router.delete("/authors/:id", deleteAuthor);

export default router;
