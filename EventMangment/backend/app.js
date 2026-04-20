import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import errorHandlingMW from "./middleware/errorHandlingMW.js";
import notFoundMW from "./middleware/notFoundMW.js";

import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";
import categoryRouter from "./routes/category.router.js";
import eventRouter from "./routes/event.router.js";
import registrationRouter from "./routes/registration.router.js";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

// General limiter for all API requests to reduce abuse and traffic spikes.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "error",
    message: "Too many requests, please try again later.",
  },
});

// Stricter limiter for authentication routes to reduce brute-force login attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

// NOTE: During development/testing, max values can be increased.
// Reduce them again before deployment for security.
app.use(generalLimiter);

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/events", eventRouter);
app.use("/api/registrations", registrationRouter);

app.use(notFoundMW);
app.use(errorHandlingMW);

export default app;
