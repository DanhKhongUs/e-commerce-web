import { users } from "controllers/user.controller";
import express from "express";
import { verifyToken } from "middleware/auth";

const router = express.Router();
router.get("/users", verifyToken, users);

export default router;
