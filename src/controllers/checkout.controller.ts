import { Request, Response } from "express";
import { AuthRequest } from "middleware/auth";
import { cartCollection } from "models/cart.model";
import { checkoutCollection } from "models/checkout.model";
import { orderCollection } from "models/order.model";
import { ObjectId } from "mongodb";

export const createCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
      req.body;
    const userId = req.user?._id;

    if (!checkoutItems || checkoutItems.length === 0) {
      return res.status(400).json({ error: "No Items In Checkout" });
    }
    const checkoutCol = await checkoutCollection.getCollection();

    const newCheckout = {
      user: userId,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    };
    const result = await checkoutCol.insertOne(newCheckout);
    if (!result.acknowledged) {
      return res.status(500).json({ error: "Failed to create checkout" });
    }

    res.status(200).json({ success: true, checkout: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const updateCheckout = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentDetails } = req.body;

    const checkoutCol = await checkoutCollection.getCollection();

    const checkout = await checkoutCol.findOne({ _id: new ObjectId(id) });
    if (!checkout) {
      return res.status(404).json({ error: "Checkout not found" });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = new Date();

      await checkoutCol.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...checkout, paymentDetails, paidAt: new Date() } }
      );
    }

    res.status(200).json({ success: true, checkout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const createCheckoutById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const checkoutCol = await checkoutCollection.getCollection();
    const orderCol = await orderCollection.getCollection();
    const cartCol = await cartCollection.getCollection();
    const checkout = await checkoutCol.findOne({ _id: new ObjectId(id) });
    if (!checkout) {
      return res.status(404).json({ error: "Checkout not found" });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      const finalOrder = await orderCol.insertOne({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: new Date(),
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      checkout.isFinalized = true;
      checkout.finalizedAt = new Date();

      await checkoutCol.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isFinalized: true, finalizedAt: new Date() } }
      );

      await cartCol.findOneAndDelete({ user: checkout.user });
      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ error: "Checkout already finalized" });
    } else {
      res.status(400).json({ error: "Checkout is not paid" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};
