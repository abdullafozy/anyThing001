import Event from "../models/event.js";
import Category from "../models/category.js";
import HTTPError from "../utils/httpError.js";

export const getAllEvents = async (req, res, next) => {
  try {
    // pagination
    const { page = 1, limit = 6 } = req.query;
    const skip = (page - 1) * limit;

    // filtering by category or search by title/location
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    // extra feature: search by title or location (case-insensitive)
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { location: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const events = await Event.find(filter)
      .populate("category", "name")
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Event.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    return res.status(200).json({ total, page: Number(page), pages, events });
  } catch (err) {
    next(err);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("category", "name description")
      .populate("createdBy", "name email");

    if (!event) return next(new HTTPError(404, "Event not found"));
    return res.status(200).json(event);
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, capacity, category } = req.body;

    // make sure the category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) return next(new HTTPError(404, "Category not found"));

    const event = await Event.create({
      title,
      description,
      date,
      location,
      capacity,
      category,
      createdBy: req.user._id,
    });

    return res.status(201).json({ message: "Event created", event });
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return next(new HTTPError(404, "Event not found"));

    // only the creator or admin can update
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new HTTPError(403, "Not authorized to update this event"));
    }

    const { title, description, date, location, capacity, category } = req.body;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) return next(new HTTPError(404, "Category not found"));
      event.category = category;
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.capacity = capacity || event.capacity;

    await event.save();
    return res.status(200).json({ message: "Event updated", event });
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return next(new HTTPError(404, "Event not found"));

    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new HTTPError(403, "Not authorized to delete this event"));
    }

    await event.deleteOne();
    return res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
};
