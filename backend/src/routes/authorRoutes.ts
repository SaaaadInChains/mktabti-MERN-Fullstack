import { Router } from "express";
import {
  getAllAuthors,
  getAuthorInfosById,
} from "../controllers/userController.js";

const router = Router();

router.get("/", getAllAuthors);
router.get("/:id", getAuthorInfosById);

export default router;
