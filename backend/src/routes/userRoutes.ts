import { Router } from "express";
import {
  showUserInfos,
  editUserInfos,
  getCurrentUser,
  changePassword,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { imageUpload } from "../middleware/fileFilter.js";
import { validate } from "../middleware/validate.js";
import { newPasswordValidation } from "../validators/authValidators.js";

const router = Router();

router.get("/me", authenticate, getCurrentUser);
router.put("/me", authenticate, imageUpload.single("avatar"), editUserInfos);
router.put(
  "/me/password",
  authenticate,
  newPasswordValidation,
  validate,
  changePassword,
);

router.get("/:id", showUserInfos);

export default router;
