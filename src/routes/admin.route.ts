import {
  deleteUser,
  getAllUsers,
  toggleBlockUser,
  updateUser,
} from "controllers/user.controller";
import express from "express";
import {
  deleteOrderForAdmin,
  getOrderForAdmin,
  updateOrderForAdmin,
} from "controllers/order.controller";
import { getDashboardData } from "controllers/dashboard.controller";

const router = express.Router();

router.get("/dashboard", getDashboardData);

router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.put("/users/:id/block", toggleBlockUser);
router.delete("/users/:id", deleteUser);

router.get("/orders", getOrderForAdmin);
router.put("/orders/:id", updateOrderForAdmin);
router.delete("/orders/:id", deleteOrderForAdmin);

export default router;
