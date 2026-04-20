import { body } from "express-validator";

export const categoryValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Category name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Category name must be between 2 and 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage("Description can't exceed 200 characters"),
];
