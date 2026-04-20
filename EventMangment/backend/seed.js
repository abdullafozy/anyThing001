import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/user.js";
import Category from "./models/category.js";
import Event from "./models/event.js";
import Registration from "./models/registration.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function seed() {
  await mongoose.connect(MONGO_URI);

  await Registration.deleteMany({});
  await Event.deleteMany({});
  await Category.deleteMany({});
  await User.deleteMany({});

  const admin = await User.create({
    name: "Admin User",
    email: "admin@test.com",
    password: "admin1234",
    role: "admin",
  });

  await User.create({
    name: "Test User",
    email: "user@test.com",
    password: "user1234",
    role: "user",
  });

  const categories = await Category.create([
    { name: "Technology", description: "" },
    { name: "Business", description: "" },
    { name: "Design", description: "" },
  ]);

  const tech = categories.find((c) => c.name === "Technology");
  const business = categories.find((c) => c.name === "Business");
  const design = categories.find((c) => c.name === "Design");

  await Event.create([
    {
      title: "Node.js Workshop",
      description: "Hands-on Node.js workshop for developers.",
      date: daysFromNow(35),
      location: "Cairo Tech Hub",
      capacity: 30,
      category: tech._id,
      createdBy: admin._id,
    },
    {
      title: "React Conference",
      description: "Community talks and networking around React.",
      date: daysFromNow(45),
      location: "Alexandria Convention Center",
      capacity: 100,
      category: tech._id,
      createdBy: admin._id,
    },
    {
      title: "Startup Pitch Night",
      description: "Pitch your startup and meet investors.",
      date: daysFromNow(60),
      location: "Cairo Business Park",
      capacity: 50,
      category: business._id,
      createdBy: admin._id,
    },
    {
      title: "UI/UX Design Sprint",
      description: "Intensive UI/UX design sprint (remote-friendly).",
      date: daysFromNow(75),
      location: "Online",
      capacity: 20,
      category: design._id,
      createdBy: admin._id,
    },
  ]);

  console.log("Seeding complete. Users, categories, and events inserted.");

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
