import { body } from "express-validator";

export const registerValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username required")
    .isLength({ min: 3, max: 15 })
    .withMessage("Username must be from 3 to 15 characters long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 8 })
    .withMessage("Must be 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Must include an uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Must include a number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Must include a special character"),
];

export const newPasswordValidation = [
  body("newPassword")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 8 })
    .withMessage("Must be 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Must include an uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Must include a number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Must include a special character"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is reaquired"),
];
