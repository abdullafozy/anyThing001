import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Registration must belong to a user"],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Registration must belong to an event"],
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    qrCode: {
      type: String,
    },
  },
  { timestamps: true }
);

// a user can only register once per event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model("Registration", registrationSchema);
