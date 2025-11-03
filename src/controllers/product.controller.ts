import { Request, Response } from "express";
import { productCollection } from "models/product.model";
import { ObjectId } from "mongodb";

const validateProductData = (data: any) => {
  const { name, price, discount, description } = data;
  if (!name || !price || !discount || !description) {
    return { error: "All fields are require" };
  }
  return null;
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const col = await productCollection.getCollection();

    const { page = 1, limit = 10 } = req.query;

    const products = await col
      .find()
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .toArray();

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
    const validateError = validateProductData(req.body);
    if (validateError) {
      return res.status(400).json(validateError);
    }

    const { name, price, discount, description, imageUrl } = req.body;

    if (!name || !price || !discount || !description || !imageUrl)
      return res.status(400).json({ error: "Data are required" });
    const col = await productCollection.getCollection();

    const newProduct = {
      _id: new ObjectId(),
      name,
      price,
      discount,
      description,
      imageUrl,
      createAt: new Date(),
      updateAt: new Date(),
    };

    const result = await col.insertOne(newProduct);
    if (!result.acknowledged) {
      return res.status(500).json({ error: "Failed to add blog" });
    }

    const insertedProduct = { ...newProduct, id: newProduct._id.toString() };

    return res.status(200).json({ success: true, product: insertedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id, name, price, discount, description, imageUrl } = req.body;
    const validateError = validateProductData(req.body);
    if (validateError) {
      return res.status(400).json(validateError);
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Product ID" });
    }

    const col = await productCollection.getCollection();
    const _id = new ObjectId(id);

    const result = await col.updateOne(
      {
        _id,
      },
      {
        $set: {
          name,
          price,
          discount,
          description,
          imageUrl,
          update_at: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: "Failed to update product" });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id || !ObjectId.isValid(id))
      return res.status(400).json({ error: "Product ID is required" });

    const col = await productCollection.getCollection();

    const result = await col.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
