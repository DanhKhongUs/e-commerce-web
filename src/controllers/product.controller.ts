import { Request, Response } from "express";
import { productCollection } from "models/product.model";
import { ObjectId } from "mongodb";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const col = await productCollection.getCollection();

    const products = await col.find().sort({ created_at: -1 }).toArray();

    const formattedProducts = products.map((product) => ({
      ...product,
      id: product._id.toString(),
      _id: undefined,
    }));

    res.json({ success: true, data: formattedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Data are required" });

    const col = await productCollection.getCollection();

    const product = await col.findOne({ _id: new ObjectId(id) });

    if (!product) return res.status(404).json({ error: "Product not found" });

    const formattedProduct = {
      ...product,
      id: id,
    };

    res.json({ success: true, data: formattedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Please login to continue" });
    }
    const { name, price, description, category, imageUrl } = req.body;

    if (!name || !price || !description || !imageUrl || !category)
      return res.status(400).json({ error: "Data are required" });

    if (!category || typeof category !== "string") {
      return res.status(400).json({ error: "Invalid category id format" });
    }

    const col = await productCollection.getCollection();

    const newProduct = {
      _id: new ObjectId(),
      name,
      price: Number(price),
      category: category
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, ""),
      description,
      imageUrl: imageUrl || "",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await col.insertOne(newProduct);
    if (!result.acknowledged) {
      return res.status(500).json({ error: "Failed to add blog" });
    }

    const insertedProduct = { ...newProduct, id: newProduct._id.toString() };

    res.status(200).json({ success: true, product: insertedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { name, price, category, description, imageUrl } = req.body;

    if (!name || !price || !description || !imageUrl || !category)
      return res.status(400).json({ error: "Data are required" });

    if (!ObjectId.isValid(category)) {
      return res.status(400).json({ error: "Invalid category id" });
    }
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const col = await productCollection.getCollection();

    const result = await col.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name,
          price: Number(price),
          description,
          category: category
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, ""),
          imageUrl,
          updated_at: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: "Failed to update product" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id))
      return res.status(400).json({ error: "Product ID is required" });

    const col = await productCollection.getCollection();

    const result = await col.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
