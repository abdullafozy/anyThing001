import Registration from "../models/registration.js";
import Event from "../models/event.js";
import HTTPError from "../utils/httpError.js";
import qrcode from "qrcode";

export const registerForEvent = async (req, res, next) => {
  try {
    const eventId = req.body.eventId;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return next(new HTTPError(404, "Event not found"));

    // check if event is full
    if (event.registeredCount >= event.capacity) {
      return next(new HTTPError(400, "Event is fully booked"));
    }

    // check if user already registered
    const alreadyRegistered = await Registration.findOne({
      user: userId,
      event: eventId,
    });
    if (alreadyRegistered) {
      return next(new HTTPError(400, "You are already registered for this event"));
    }

    // create registration and bump registeredCount
    const registration = await Registration.create({
      user: userId,
      event: eventId,
    });

    // Data encoded in the QR code for check-in/verification at the event.
    const qrPayload = {
      registrationId: registration._id.toString(),
      eventTitle: event.title,
      userName: req.user.name,
      date: event.date,
    };
    const qrData = JSON.stringify(qrPayload);

    // Generate QR code as a Data URL and store it on the registration record.
    const qrCode = await qrcode.toDataURL(qrData);
    registration.qrCode = qrCode;
    await registration.save();

    event.registeredCount += 1;
    await event.save();

    return res.status(201).json({
      message: "Successfully registered for the event",
      registration,
    });
  } catch (err) {
    next(err);
  }
};

export const cancelRegistration = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const registration = await Registration.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!registration) {
      return next(new HTTPError(404, "Registration not found"));
    }

    const eventId = registration.event;
    await registration.deleteOne();

    // decrease count
    const event = await Event.findById(eventId);
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
      await event.save();
    }

    return res.status(200).json({ message: "Registration cancelled" });
  } catch (err) {
    next(err);
  }
};

export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event", "title date location capacity registeredCount")
      .lean();

    return res.status(200).json({
      count: registrations.length,
      registrations,
    });
  } catch (err) {
    next(err);
  }
};

// admin: get all registrations for a specific event
export const getEventRegistrations = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return next(new HTTPError(404, "Event not found"));

    const registrations = await Registration.find({ event: req.params.id })
      .populate("user", "name email")
      .lean();

    return res.status(200).json({
      event: event.title,
      count: registrations.length,
      registrations,
    });
  } catch (err) {
    next(err);
  }
};
