import { connectDB } from "@/lib/db";
import Store from "@/models/Store";
import { NextRequest, NextResponse } from "next/server";

// Get store info & store products
export async function GET(req: NextRequest) {
  try {
    // Get store username from query params
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    await connectDB();

    // Tìm cửa hàng + load danh sách sản phẩm + đánh giá
    const store = await Store.findOne({
      username: username.toLowerCase(),
      isActive: true,
    })
      .populate({
        path: "products",
        match: { inStock: true },
        populate: { path: "rating" },
      })
      .lean(); // nhẹ hơn khi chỉ đọc dữ liệu

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({ store });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
