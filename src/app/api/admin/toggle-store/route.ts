import { connectDB } from "@/lib/db";
import { handleError } from "@/lib/handleError";
import authAdmin from "@/middlewares/authAdmin";
import Store from "@/models/Store";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Toggle Store isActive
export async function POST(req: NextRequest) {
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

    const { storeId } = await req.json();
    if (!storeId) {
      return NextResponse.json({ error: "Missing storeId" }, { status: 400 });
    }

    // Find the store
    const store = await Store.findById(storeId);

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const updated = await Store.findOneAndUpdate(storeId, {
      isActive: !store.isActive,
    });

    return NextResponse.json({
      message: "Store updated successfully",
      store: updated,
    });
  } catch (error) {
    return handleError(error);
  }
}
