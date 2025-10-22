import { connectDB } from "@/lib/db";
import { handleError } from "@/lib/handleError";
import authSeller from "@/middlewares/authSeller";
import Store from "@/models/Store";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Auth Seller
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const storeInfo = await Store.findOne({ userId });

    return NextResponse.json({ isSeller, storeInfo });
  } catch (error) {
    return handleError(error);
  }
}
