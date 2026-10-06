import { Router } from "express";
import { ollamaController } from "../controllers/ollamaController.js";

const router = Router();

router.post("/", ollamaController);

export default router;
