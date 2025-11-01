import express from "express";
import { requireAdmin, verifyToken } from "middleware/auth";

const router = express.Router();

router.get("/dashboard", verifyToken, requireAdmin, (req, res) => {
  res.json({ message: "Welcome admin" });
});
