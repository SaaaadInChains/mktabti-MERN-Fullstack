import express from "express";
import { type Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import {
  loginValidation,
  registerValidation,
} from "../validators/authValidators.js";
import { authLimiter } from "../security/rateLimiter.js";

const router: Router = express.Router();

router.use(authLimiter);

router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginValidation, loginUser, validate, loginUser);
router.post("/logout", logoutUser);

export default router;
