import { Request, Response } from "express";
import { categoryCollection } from "models/category.model";
import { ObjectId } from "mongodb";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const col = await categoryCollection.getCollection();

    const categories = await col
      .find()
      .sort({ created_at: -1 })
      .project({ created_at: 0 })
      .toArray();

    const formatted = categories.map((c) => ({
      ...c,
      id: c._id.toString(),
      _id: undefined,
    }));

    res.json({ success: true, data: formatted });
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

    const exists = await col.findOne({ category_id: format_category_id });
    if (exists)
      return res.status(400).json({ error: "CATEGORY_ALREADY_EXISTS" });

    const newCat = {
      _id: new ObjectId(),
      category_id: format_category_id,
      category_name,
      created_at: new Date(),
    };

    await col.insertOne(newCat);

    res.json({ success: true, data: { id: newCat._id.toString(), ...newCat } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Category ID is required" });

    const { category_id, category_name } = req.body;

    if (!category_id || !category_name)
      return res.status(400).json({ error: "INVALID_DATA" });

    const format_category_id = category_id
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

    const col = await categoryCollection.getCollection();

    const result = await col.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          category_id: format_category_id,
          category_name,
          updated_at: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0)
      return res.status(500).json({ error: "Failed to update category" });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Category ID is required" });

    const col = await categoryCollection.getCollection();

    const result = await col.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Category not found" });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};
