import { Request, Response } from "express";
import { checkoutCollection } from "models/checkout.model";
import { productCollection } from "models/product.model";
import { userCollection } from "models/user.model";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const productCol = await productCollection.getCollection();
    const totalProducts = await productCol.countDocuments();

    const userCol = await userCollection.getCollection();
    const totalUsers = await userCol.countDocuments();

    const checkoutCol = await checkoutCollection.getCollection();
    const allCheckouts = await checkoutCol
      .find({ status: { $in: ["pending", "success"] } })
      .toArray();

    const totalOrders = allCheckouts.length;

    const totalRevenue = allCheckouts.reduce(
      (sum, o) => sum + (o.finalPrice ?? o.totalPrice ?? 0),
      0
    );

    return res.json({
      message: "Dashboard data fetched successfully",
      data: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};
