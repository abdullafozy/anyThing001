import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name can't exceed 50 characters"],
    },
    description: {
      type: String,
      maxlength: [200, "Description can't exceed 200 characters"],
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
