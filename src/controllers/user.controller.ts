import { Request, Response } from "express";
import { userCollection } from "models/user.model";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { CollectionManager } from "lib/mongodb-wrapper";
import { IUser } from "types/user";

dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "ACCOUNT_INVALID" });

    const users = new CollectionManager<IUser>("users");

    const col = await users.getCollection();

    const exists = await col.findOne({ email });

    if (exists) return res.status(400).json("ACCOUNT_ALREADY_EXISTS");

    const hmac = crypto.createHmac("sha256", process.env.CRYPT_SECRET!);

    hmac.update(password);
    const password_hash = hmac.digest("hex");
    await col.insertOne({
      email,
      password_hash,
      role: "user",
      created_at: new Date(),
    });

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "ACCOUNT_INVALID" });

    const users = new CollectionManager<IUser>("users");
    const col = await users.getCollection();

    const user = await col.findOne(
      { email },
      { projection: { password_hash: 1 } }
    );

    if (!user) return res.status(404).json({ error: "ACCOUNT_NOT_FOUND" });

    const hmac = crypto.createHmac("sha256", process.env.CRYPT_SECRET!);

    hmac.update(password);

    const c_password_hash = hmac.digest("hex");
    if (user.password_hash !== c_password_hash)
      return res.status(401).json({ error: "WRONG_PASSWORD" });

    const token = jwt.sign(
      { email, role: user.role || "user" },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("session_token", token, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("session_token", { path: "/" });
    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Logout failed" });
  }
};
