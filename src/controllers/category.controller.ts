import { Request, Response } from "express";
import { categoryCollection } from "models/category.model";
import { ObjectId } from "mongodb";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const col = await categoryCollection.getCollection();

    const categories = await col
      .find()
      .sort({ createdAt: -1 })
      .project({ createdAt: 0 })
      .toArray();

    return res.json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Data are require" });

    const col = await categoryCollection.getCollection();
    const category = await col.findOne({ _id: new ObjectId(id) });

    if (!category) return res.status(404).json({ error: "Category not found" });

    return res.json({ success: true, data: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { category_name, category_id } = req.body;

    if (!category_name || !category_id)
      return res.status(400).json({ error: "INVALID_DATA" });

    const col = await categoryCollection.getCollection();

    const format_category_id = category_id
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

    const response = await col.updateOne(
      {
        category_id: format_category_id,
      },
      {
        $setOnInsert: {
          category_name,
          created_at: new Date(),
        },
      },
      { upsert: true }
    );

    if (response.upsertedCount === 0)
      return res.status(400).json({ error: "CATEGORY_ALREADY_EXISTS" });

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { category_id, category_name } = req.body;

    if (!category_id || !category_name)
      return res.status(400).json({ error: "INVALID_DATA" });

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid Category ID" });

    const format_category_id = category_id
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

    const col = await categoryCollection.getCollection();

    const _id = new ObjectId(id);
    const result = await col.updateOne(
      {
        _id,
      },
      {
        $set: {
          category_id,
          category_name,
          updated_at: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0)
      return res.status(500).json({ error: "Failed to update category" });

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id))
      return res.status(400).json({ error: "Category ID is required" });

    const col = await categoryCollection.getCollection();

    const result = await col.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Category not found" });

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};
