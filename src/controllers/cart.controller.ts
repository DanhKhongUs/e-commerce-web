import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { cartCollection } from "models/cart.model";
import { productCollection } from "models/product.model";

export const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const cartCol = await cartCollection.getCollection();

    const cart = await cartCol.findOne({ userId });
    if (!cart) {
      return res.json({ success: true, data: { products: [], totalPrice: 0 } });
    }

    const { _id, ...cartData } = cart;

    return res.json({ success: true, data: cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

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
    if (!userId) return res.status(400).json({ error: "User ID is required" });

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

    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const cartCol = await cartCollection.getCollection();
    const cart = await cartCol.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

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
