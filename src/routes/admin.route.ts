import { loginUser } from "controllers/user.controller";
import express, { Request, Response } from "express";
import { requireAdmin, verifyToken } from "middleware/auth";
import { userCollection } from "models/user.model";
import crypto from "crypto";

const router = express.Router();

router.post(
  "/create-admin",
  //   requireAdmin,
  //   verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "INVALID_DATA" });
      }

      const finalRole = role === "admin" ? "admin" : "user";

      const col = await userCollection.getCollection();

      const exists = await col.findOne({ email });
      if (exists) {
        return res.status(400).json({ error: "EMAIL_ALREADY_EXISTS" });
      }

      const hmac = crypto.createHmac("sha256", process.env.CRYPT_SECRET!);
      hmac.update(password);
      const password_hash = hmac.digest("hex");

      await col.insertOne({
        name,
        email,
        password_hash,
        role: finalRole,
        created_at: new Date(),
      });

      return res.json({
        success: true,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }
);

export default router;
