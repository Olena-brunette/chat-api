import { Router, Request, Response } from "express";
import User from "../models/user.model.js";
import { HttpStatusCode } from "axios";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const router = Router();

//   @ts-ignore
router.post("/", async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ error: "Login and password are required" });
    }
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res
        .status(HttpStatusCode.Conflict)
        .json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const createdAt = Date.now();
    await User.create({ id, login, password: hashedPassword, createdAt });
    res.status(HttpStatusCode.Created).json({ id, login, createdAt });
  } catch (err) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: "Failed to create user" });
  }
});

export default router;
