import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "controllers/category.controller";
import express from "express";
import { verifyToken } from "middleware/auth";

const router = express.Router();

router.get("/categories", getAllCategories);
router.post("/categories", verifyToken, createCategory);
router.put("/categories/:id", verifyToken, updateCategory);
router.delete("/categories/:id", verifyToken, deleteCategory);

export default router;
