import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import authMW from "../middleware/authMW.js";
import { authorize } from "../middleware/authorizeMW.js";
import validateResults from "../middleware/validateResults.js";
import { idParamValidator } from "../validations/commonValidators.js";
import { categoryValidator } from "../validations/categoryValidators.js";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id", idParamValidator, validateResults, getCategoryById);

// only admin can create, update, delete categories
router.post("/", authMW, authorize("admin"), categoryValidator, validateResults, createCategory);
router.patch("/:id", authMW, authorize("admin"), idParamValidator, categoryValidator, validateResults, updateCategory);
router.delete("/:id", authMW, authorize("admin"), idParamValidator, validateResults, deleteCategory);

export default router;
