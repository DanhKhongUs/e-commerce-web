import {
  deleteOrder,
  getAllOrdersAdminOnly,
  updateOrder,
} from "controllers/order.controller";
import express from "express";
import { requireAdmin, verifyToken } from "middleware/auth";

const router = express.Router();

router.get("/orders", verifyToken, requireAdmin, getAllOrdersAdminOnly);

router.put("/orders/:id", verifyToken, requireAdmin, updateOrder);
router.delete("/orders/:id", verifyToken, requireAdmin, deleteOrder);

export default router;
