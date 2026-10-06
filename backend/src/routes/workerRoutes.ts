import { Router } from "express";
import {
  getAllBooks,
  getAllAuthors,
  getAllUsers,
  createBook,
  editBook,
  createAuthor,
  editAuthor,
} from "../controllers/workerController.js";
import { authenticate } from "../middleware/auth.js";
import { requireWorker } from "../middleware/requireWorker.js";
import { imageUpload } from "../middleware/fileFilter.js";

const router = Router();

router.use(authenticate, requireWorker);

router.get("/books", getAllBooks);
router.get("/authors", getAllAuthors);
router.get("/users", getAllUsers);

router.post("/books", imageUpload.single("cover"), createBook);
router.put("/books/:id", imageUpload.single("cover"), editBook);

router.post("/authors", imageUpload.single("picture"), createAuthor);
router.put("/authors/:id", imageUpload.single("picture"), editAuthor);

export default router;
