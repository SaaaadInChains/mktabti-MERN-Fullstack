import { Router } from "express";
import {
  getAllBooks,
  getBooksInfosById,
} from "../controllers/userController.js";

const router = Router();

router.get("/", getAllBooks);
router.get("/:id", getBooksInfosById);

export default router;
