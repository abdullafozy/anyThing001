import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import validateResults from "../middleware/validateResults.js";
import { registerValidator, loginValidator } from "../validations/authValidators.js";

const router = Router();

router.post("/register", registerValidator, validateResults, register);
router.post("/login", loginValidator, validateResults, login);

export default router;
