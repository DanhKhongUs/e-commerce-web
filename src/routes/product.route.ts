import express from "express";
import { requireAdmin, verifyToken } from "middleware/auth";

const router = express.Router();
router.get("/", (req, res) => {
  res.json({ message: "List of products" });
});

router.post("/", verifyToken, requireAdmin, (req, res) => {
  res.json({ message: "Product created successfully" });
});

router.put("/:id", verifyToken, requireAdmin, (req, res) => {
  res.json({ message: `Product ${req.params.id} updated` });
});

router.delete("/:id", verifyToken, requireAdmin, (req, res) => {
  res.json({ message: `Product ${req.params.id} deleted` });
});

export default router;
