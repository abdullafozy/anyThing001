import { param, query } from "express-validator";

export const idParamValidator = [
  param("id")
    .notEmpty().withMessage("ID param is missing")
    .isMongoId().withMessage("Invalid ID format"),
];

export const paginationValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("page must be a number greater than 0")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1 }).withMessage("limit must be a number greater than 0")
    .toInt(),
];
