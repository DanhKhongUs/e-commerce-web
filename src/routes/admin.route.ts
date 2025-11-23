import { deleteUser, getAllUsers } from "controllers/user.controller";
import express from "express";
import {
  deleteOrderForAdmin,
  getOrderForAdmin,
} from "controllers/order.controller";
import { getDashboardData } from "controllers/dashboard.controller";

const router = express.Router();

router.get("/dashboard", getDashboardData);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/orders", getOrderForAdmin);
router.delete("/orders/:id", deleteOrderForAdmin);

export default router;
