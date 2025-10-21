import { connectDB } from "@/lib/db";
import authSeller from "@/middlewares/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Toggle stock of a product
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { error: "Missing details: productId" },
        { status: 400 }
      );
    }

    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // Check if product exists
    const product = await Product.findOne({ _id: productId, storeId });

    if (!product) {
      return NextResponse.json({ error: "No product found" }, { status: 400 });
    }

    // Toggle trạng thái tồn kho
    product.inStock = !product.inStock;
    await product.save();

    return NextResponse.json({
      message: "Product stock updated successfully",
      inStock: product.inStock,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
