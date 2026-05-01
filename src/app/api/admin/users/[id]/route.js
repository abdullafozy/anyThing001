import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    await User.findByIdAndUpdate(params.id, { isActive: body.isActive });
    return NextResponse.json({ message: "User updated" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}