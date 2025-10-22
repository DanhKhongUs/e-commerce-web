import { connectDB } from "@/lib/db";
import { handleError } from "@/lib/handleError";
import authAdmin from "@/middlewares/authAdmin";
import Store from "@/models/Store";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Approve store
export async function PATCH(req: NextRequest) {
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

    const { storeId, status } = await req.json();

    if (status === "approved") {
      await Store.findOneAndUpdate(
        { _id: storeId },
        { status: "approved", isActive: true }
      );
    } else if (status === "rejected") {
      await Store.findOneAndUpdate(
        { _id: storeId },
        { status: "rejected", isActive: true }
      );
    }
    return NextResponse.json({ message: status + "successfully" });
  } catch (error) {
    return handleError(error);
  }
}

// Get all pending and rejected stores
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
      status: { $in: ["pending", "rejected"] },
    })
      .populate("user")
      .sort({ createdAt: -1 });

    return NextResponse.json({ stores });
  } catch (error) {
    return handleError(error);
  }
}
