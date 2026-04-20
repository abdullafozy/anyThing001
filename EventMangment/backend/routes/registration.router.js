import { Router } from "express";
import {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
} from "../controllers/registration.controller.js";
import authMW from "../middleware/authMW.js";
import validateResults from "../middleware/validateResults.js";
import { idParamValidator } from "../validations/commonValidators.js";

const router = Router();

// get all my registrations
router.get("/my", authMW, getMyRegistrations);

// register for an event
router.post("/", authMW, registerForEvent);

// cancel a registration
router.delete("/:id", authMW, idParamValidator, validateResults, cancelRegistration);

export default router;
