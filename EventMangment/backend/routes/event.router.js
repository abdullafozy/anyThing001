import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import {
  getEventRegistrations,
} from "../controllers/registration.controller.js";
import authMW from "../middleware/authMW.js";
import { authorize } from "../middleware/authorizeMW.js";
import validateResults from "../middleware/validateResults.js";
import { idParamValidator, paginationValidator } from "../validations/commonValidators.js";
import { createEventValidator, updateEventValidator } from "../validations/eventValidators.js";

const router = Router();

// public routes
router.get("/", paginationValidator, validateResults, getAllEvents);
router.get("/:id", idParamValidator, validateResults, getEventById);

// protected routes - any logged-in user can create events
router.post("/", authMW, createEventValidator, validateResults, createEvent);
router.patch("/:id", authMW, idParamValidator, updateEventValidator, validateResults, updateEvent);
router.delete("/:id", authMW, idParamValidator, validateResults, deleteEvent);

// admin: see who registered for an event
router.get("/:id/registrations", authMW, authorize("admin"), idParamValidator, validateResults, getEventRegistrations);

export default router;
