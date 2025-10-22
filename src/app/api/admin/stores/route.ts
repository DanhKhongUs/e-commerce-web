import { connectDB } from "@/lib/db";
import { handleError } from "@/lib/handleError";
import authAdmin from "@/middlewares/authAdmin";
import Store from "@/models/Store";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Get all approve stores
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    const stores = await Store.find({
      status: "approve",
    }).populate("user");

    return NextResponse.json({ stores });
  } catch (error) {
    return handleError(error);
  }
}
