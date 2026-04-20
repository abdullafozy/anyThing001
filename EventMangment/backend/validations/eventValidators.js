import { body } from "express-validator";

export const createEventValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Event title is required")
    .isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Event description is required")
    .isLength({ max: 1000 }).withMessage("Description can't exceed 1000 characters"),

  body("date")
    .notEmpty().withMessage("Event date is required")
    .isISO8601().withMessage("Date must be a valid date (e.g. 2025-08-20T18:00:00Z)")
    .toDate(),

  body("location")
    .trim()
    .notEmpty().withMessage("Event location is required")
    .isLength({ max: 200 }).withMessage("Location can't exceed 200 characters"),

  body("capacity")
    .notEmpty().withMessage("Event capacity is required")
    .isInt({ min: 1 }).withMessage("Capacity must be a positive number")
    .toInt(),

  body("category")
    .notEmpty().withMessage("Category is required")
    .isMongoId().withMessage("Category must be a valid ID"),
];

export const updateEventValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Description can't exceed 1000 characters"),

  body("date")
    .optional()
    .isISO8601().withMessage("Date must be a valid date")
    .toDate(),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage("Location can't exceed 200 characters"),

  body("capacity")
    .optional()
    .isInt({ min: 1 }).withMessage("Capacity must be a positive number")
    .toInt(),

  body("category")
    .optional()
    .isMongoId().withMessage("Category must be a valid ID"),
];
