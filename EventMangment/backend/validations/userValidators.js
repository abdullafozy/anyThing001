import { body } from "express-validator";

export const updateUserValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Please enter a valid email")
    .normalizeEmail(),
];
