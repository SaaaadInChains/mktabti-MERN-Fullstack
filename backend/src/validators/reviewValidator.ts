import { body } from "express-validator";

export const reviewValidation = [ 
   body("rating")
  .trim()
  .notEmpty()
  .withMessage("Insert a review")
  .isInt({ min: 1, max: 5 })
  .withMessage("Review should be from 1 to 5"),
];
