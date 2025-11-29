import { Request, Response } from "express";
import { AuthRequest } from "middleware/auth";
import { checkoutCollection } from "models/checkout.model";
import { ObjectId } from "mongodb";
import { userCollection } from "models/user.model";

export const getOrderForAdmin = async (req: Request, res: Response) => {
  try {
    const checkoutCol = await checkoutCollection.getCollection();
    const userCol = await userCollection.getCollection();

    const checkouts = await checkoutCol
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    const user = checkouts
      .map((c) => c.userId)
      .filter((id) => id)
      .map((id) => new ObjectId(id));

    const users = await userCol.find({ _id: { $in: user } }).toArray();

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const orders = checkouts.map((o) => {
      const user = userMap.get(o.userId?.toString());

      return {
        id: o.orderId,
        user: user
          ? {
              fullName: user.name,
              email: user.email,
            }
          : null,
        status: o.status,
        amount: o.finalPrice ?? o.totalPrice ?? 0,
        createdAt: o.createdAt,
        method: o.paymentMethod,
      };
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const updateOrderForAdmin = async (req: Request, res: Response) => {
  try {
    const { id: orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "success", "failed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "INVALID_STATUS" });
    }

    const checkoutCol = await checkoutCollection.getCollection();

    const order = await checkoutCol.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: "ORDER_NOT_FOUND" });
    }

    const result = await checkoutCol.updateOne(
      { orderId },
      { $set: { status } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "ORDER_NOT_UPDATED" });
    }

    return res.json({
      success: true,
      message: "Order status updated successfully",
    });
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
