import { Request, Response } from "express";
import { AuthRequest } from "middleware/auth";
import { orderCollection } from "models/order.model";
import { ObjectId } from "mongodb";

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const orderCol = await orderCollection.getCollection();

    const orders = await orderCol
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const orderCol = await orderCollection.getCollection();

    const order = await orderCol.findOne({ _id: new ObjectId(id) });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const getAllOrdersAdminOnly = async (req: Request, res: Response) => {
  try {
    const orderCol = await orderCollection.getCollection();
    const orders = await orderCol.find({}).toArray();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const orderCol = await orderCollection.getCollection();
    const order = await orderCol.findOne({ _id: new ObjectId(id) });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const updatedFields: any = {};
    if (status) {
      updatedFields.status = status;
      if (status === "Delivered") {
        updatedFields.isDelivered = true;
        updatedFields.deliveredAt = new Date();
      }
    }

    const result = await orderCol.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFields }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "Failed to update the order" });
    }

    const updatedOrder = await orderCol.findOne({ _id: new ObjectId(id) });
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orderCol = await orderCollection.getCollection();

    const order = await orderCol.findOne({ _id: new ObjectId(id) });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const result = await orderCol.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return res.json({ message: "Order removed successfully" });
    } else {
      return res.status(500).json({ message: "Failed to remove order" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};
