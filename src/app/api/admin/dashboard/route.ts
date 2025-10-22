import { connectDB } from "@/lib/db";
import { handleError } from "@/lib/handleError";
import authAdmin from "@/middlewares/authAdmin";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Store from "@/models/Store";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Get Dashboard Data for Admin (total orders, total stores, total products, total revenue)
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

    // Get total orders
    const orders = await Order.countDocuments();
    //Get total stores on app
    const stores = await Store.countDocuments();

    // Get all orders include only createAt and total & calculate total revenue
    const allOrders = await Order.find().select("createdAt total");

    const totalRevenue = allOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    const revenue = Number(totalRevenue.toFixed(2));
    // Total products on app
    const products = await Product.countDocuments();

    const dashboardData = {
      orders,
      stores,
      products,
      revenue,
      recentOrders: allOrders.slice(-5).reverse(), //gửi 5 đơn gần nhất
    };

    return NextResponse.json({ dashboardData });
  } catch (error) {
    return handleError(error);
  }
}
