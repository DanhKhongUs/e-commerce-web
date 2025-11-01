import {
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "controllers/user.controller";
import express from "express";
import { verifyToken } from "middleware/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", verifyToken, getProfile);

export default router;
