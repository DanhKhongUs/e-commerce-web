import {
  addToCart,
  deleteCart,
  getCart,
  mergeCart,
  updateCart,
} from "controllers/cart.controller";
import express from "express";
import { verifyToken } from "middleware/auth";

const router = express.Router();

router.get("/", getCart);
router.post("/", verifyToken, addToCart);
router.put("/", verifyToken, updateCart);
router.delete("/", verifyToken, deleteCart);

router.post("/merge", mergeCart);
export default router;
