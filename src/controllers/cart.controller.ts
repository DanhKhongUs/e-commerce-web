import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { cartCollection } from "models/cart.model";
import { productCollection } from "models/product.model";

export const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const cartCol = await cartCollection.getCollection();

    const cart = await cartCol.findOne({ userId });
    if (!cart) {
      return res.json({ item: [], totalPrice: 0 });
    }

    return res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, userId } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "Missing productId or quantity" });
    }
    const productCol = await productCollection.getCollection();
    const product = await productCol.findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const cartCol = await cartCollection.getCollection();

    let cart = await cartCol.findOne({ userId });

    if (!cart) {
      cart = {
        _id: new ObjectId(),
        userId,
        products: [
          {
            productId,
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.price,
            quantity: Number(quantity),
          },
        ],
        totalPrice: product.price * quantity,
        created_at: new Date(),
        updated_at: new Date(),
      };
      await cartCol.insertOne(cart);
    } else {
      const index = cart.products.findIndex(
        (p: any) => p.productId === productId
      );

      if (index >= 0) {
        cart.products[index].quantity += Number(quantity);
      } else {
        cart.products.push({
          productId,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: Number(quantity),
        });
      }

      cart.totalPrice = cart.products.reduce(
        (sum: number, p: any) => sum + p.price * p.quantity,
        0
      );
      cart.updated_at = new Date();

      await cartCol.updateOne({ userId }, { $set: cart });
    }

    res.json({ success: true, message: "Product added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  try {
    const { productId, userId, quantity } = req.body;

    const cartCol = await cartCollection.getCollection();

    let cart = await cartCol.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.products.findIndex(
      (p: any) => p.productId === productId
    );

    if (index < 0)
      return res.status(404).json({ message: "Product not found in cart" });

    if (quantity <= 0) {
      cart.products.splice(index, 1);
    } else {
      cart.products[index].quantity = quantity;
    }

    cart.totalPrice = cart.products.reduce(
      (sum: number, p: any) => sum + p.price * p.quantity,
      0
    );
    cart.updated_at = new Date();

    await cartCol.updateOne({ userId }, { $set: cart });

    return res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const deleteCart = async (req: Request, res: Response) => {
  try {
    const { productId, userId } = req.body;

    const cartCol = await cartCollection.getCollection();

    let cart = await cartCol.findOne(userId);
    if (!cart) return res.status(400).json({ message: "Cart not found" });

    const index = cart.products.findIndex(
      (p: any) => p.productId === productId
    );

    if (index < 0)
      return res.status(404).json({ message: "Product not found in cart" });

    cart.products.splice(index, 1);
    cart.totalPrice = cart.products.reduce(
      (sum: number, p: any) => sum + p.price * p.quantity,
      0
    );
    cart.updated_at = new Date();

    await cartCol.updateOne({ userId }, { $set: cart });

    return res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const mergeCart = async (req: Request, res: Response) => {
  try {
    const { guestId, userId } = req.body;
    const cartCol = await cartCollection.getCollection();

    const guestCart = await cartCol.findOne({ userId: guestId });
    const userCart = await cartCol.findOne({ userId });

    if (!guestCart)
      return res.status(404).json({ message: "Guest cart not found" });

    if (userCart) {
      guestCart.products.forEach((guestItem: any) => {
        const index = userCart.products.findIndex(
          (item: any) => item.productId === guestItem.productId
        );
        if (index >= 0) {
          userCart.products[index].quantity += guestItem.quantity;
        } else {
          userCart.products.push(guestItem);
        }
      });

      userCart.totalPrice = userCart.products.reduce(
        (sum: number, p: any) => sum + p.price * p.quantity,
        0
      );

      await cartCol.updateOne({ userId }, { $set: userCart });
      await cartCol.deleteOne({ userId: guestId });

      res.json(userCart);
    } else {
      guestCart.userId = userId;
      await cartCol.updateOne({ _id: guestCart._id }, { $set: guestCart });
      res.json(guestCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};
