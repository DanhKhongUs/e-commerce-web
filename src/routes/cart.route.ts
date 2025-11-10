import {
  addToCart,
  deleteCart,
  getCart,
  updateCart,
} from "controllers/cart.controller";
import express from "express";
import { verifyToken } from "middleware/auth";

const router = express.Router();

router.get("/", verifyToken, getCart);
router.post("/", verifyToken, addToCart);
router.put("/", verifyToken, updateCart);
router.delete("/", verifyToken, deleteCart);

export default router;
