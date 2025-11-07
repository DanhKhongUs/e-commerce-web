import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "controllers/product.controller";
import express from "express";
import { requireAdmin, verifyToken } from "middleware/auth";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", verifyToken, createProduct);

router.put("/:id", verifyToken, updateProduct);

router.delete("/:id", verifyToken, deleteProduct);

export default router;
