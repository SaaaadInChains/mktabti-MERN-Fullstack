import { body } from "express-validator";

export const commentValidation = [
  body("content")
    .notEmpty()
    .withMessage("Insert a comment")
    .isLength({ max: 50 })
    .withMessage("Error too long comment"),
];
