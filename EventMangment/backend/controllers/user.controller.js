import User from "../models/user.js";
import HTTPError from "../utils/httpError.js";

export const getAllUsers = async (req, res, next) => {
  try {
    // never return passwords
    const users = await User.find().select("-password");
    return res.status(200).json({ count: users.length, users });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return next(new HTTPError(404, "User not found"));
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return next(new HTTPError(404, "User not found"));

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    return res.status(200).json({
      message: "User updated",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new HTTPError(404, "User not found"));

    await user.deleteOne();
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
