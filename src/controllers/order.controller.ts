import { Request, Response } from "express";
import { AuthRequest } from "middleware/auth";
import { checkoutCollection } from "models/checkout.model";

export const getOrderForAdmin = async (req: Request, res: Response) => {
  try {
    const checkoutCol = await checkoutCollection.getCollection();
    const checkouts = await checkoutCol
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    const orders = checkouts.map((o) => ({
      id: o.orderId,
      status: o.status,
      amount: o.finalPrice ?? o.totalPrice ?? 0,
      products: o.products,
      createdAt: o.createdAt,
      method: o.paymentMethod,
    }));
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const deleteOrderForAdmin = async (req: Request, res: Response) => {
  try {
    const { id: orderId } = req.params;

    const checkoutCol = await checkoutCollection.getCollection();

    const order = await checkoutCol.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: "ORDER_NOT_FOUND" });
    }

    await checkoutCol.deleteOne({ orderId });

    return res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }
    const checkoutCol = await checkoutCollection.getCollection();
    const checkouts = await checkoutCol
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    const orders = checkouts.map((o) => ({
      id: o.orderId,
      status: o.status,
      amount: o.finalPrice ?? o.totalPrice ?? 0,
      products: o.products,
      createdAt: o.createdAt,
      method: o.paymentMethod,
    }));
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id: orderId } = req.params;

    const checkoutCol = await checkoutCollection.getCollection();
    const orderCol = await checkoutCol.findOne({ orderId });

    if (!orderCol) {
      return res.status(404).json({ error: "ORDER_NOT_FOUND" });
    }

    const statusValue =
      typeof orderCol.status === "string"
        ? orderCol.status
        : orderCol.status?.state || orderCol.status?.value || "pending";

    const order = {
      order: {
        id: orderCol.orderId,
        status: statusValue,
        amount: orderCol.finalPrice ?? orderCol.totalPrice ?? 0,
        createdAt: orderCol.createdAt,
        method: orderCol.paymentMethod,
        products: orderCol.products,
      },
      userId: orderCol.userId,
    };

    return res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(400).json({ error: "UNAUTHORIZED" });

    const { orderId, amount, paymentMethod } = req.body;
    const checkoutCol = await checkoutCollection.getCollection();

    const newOrder = {
      orderId,
      userId,
      amount,
      paymentMethod,
      status: "pending",
      createAt: new Date(),
    };

    await checkoutCol.insertOne(newOrder);

    return res.status(200).json({ success: true, orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const deleteOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const { id: orderId } = req.params;

    const checkoutCol = await checkoutCollection.getCollection();

    const order = await checkoutCol.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: "ORDER_NOT_FOUND" });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "FORBIDDEN" });
    }

    await checkoutCol.deleteOne({ orderId });

    return res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};
