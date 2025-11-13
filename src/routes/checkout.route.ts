import {
  createCheckout,
  createCheckoutById,
  updateCheckout,
} from "controllers/checkout.controller";
import express from "express";
import { verifyToken } from "middleware/auth";

const router = express.Router();

router.post("/", verifyToken, createCheckout);

router.put("/:id/pay", verifyToken, updateCheckout);

router.post("/:id/finalize", verifyToken, createCheckoutById);

export default router;
