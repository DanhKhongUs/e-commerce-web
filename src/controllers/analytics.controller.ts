import { Request, Response } from "express";
import { orderCollection } from "models/order.model";
import { productCollection } from "models/product.model";

export const getAnalyticsData = async (req: Request, res: Response) => {
  try {
    const productCol = await productCollection.getCollection();
    const totalProduct = await productCol.countDocuments();

    const orderCol = await orderCollection.getCollection();
    const totalOrder = await orderCol.countDocuments();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};
