import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HTTPError from "../utils/httpError.js";

export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(new HTTPError(401, "No token provided"));

    const token = authHeader.split(" ")[1];
    if (!token) return next(new HTTPError(401, "No token provided"));

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(new HTTPError(401, err.message));
    }

    const user = await User.findById(payload.userId);
    if (!user) return next(new HTTPError(404, "User not found"));

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
