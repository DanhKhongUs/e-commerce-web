// Get Dashboard Data for Seller (total orders, total earnings, total products)

import { connectDB } from "@/lib/db";
import authSeller from "@/middlewares/authSeller";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Rating from "@/models/Rating";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    //Get all orders for seller
    const orders = await Order.find({ storeId });

    // Get all Products with ratings for seller
    const products = await Product.find({ storeId });

    const ratings = await Rating.find({
      productId: { $in: products.map((p) => p._id) },
    })
      .populate("user")
      .populate("product");

    const dashboardData = {
      ratings,
      totalOrders: orders.length,
      totalEarnings: Math.round(
        orders.reduce((acc, order) => acc + (order.total || 0), 0)
      ),
      totalProducts: products.length,
    };

    return NextResponse.json({ dashboardData });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
