import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import authMW from "../middleware/authMW.js";
import { authorize } from "../middleware/authorizeMW.js";
import validateResults from "../middleware/validateResults.js";
import { idParamValidator } from "../validations/commonValidators.js";
import { updateUserValidator } from "../validations/userValidators.js";

const router = Router();

// admin only
router.get("/", authMW, authorize("admin"), getAllUsers);

// any logged-in user can view/update/delete their own profile
// admin can manage all
router.get("/:id", authMW, idParamValidator, validateResults, getUserById);
router.patch("/:id", authMW, idParamValidator, updateUserValidator, validateResults, updateUser);
router.delete("/:id", authMW, authorize("admin"), idParamValidator, validateResults, deleteUser);

export default router;
