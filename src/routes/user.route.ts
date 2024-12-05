import { Router, Request, Response } from "express";
import User from "../models/user.model.js";
import { HttpStatusCode } from "axios";
import bcrypt from "bcrypt";
import { ResponceMessage } from "../constants.js";

// TODO: remove ts-ignore comments
const router = Router();

// @ts-ignore
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

    const newUser = new User({
      login,
      password: hashedPassword,
      createdAt: Date.now(),
    });

    await newUser.save();

    res
      .status(HttpStatusCode.Created)
      .json({ login: newUser.login, createdAt: newUser.createdAt });
  } catch (err) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: ResponceMessage.InternalServerError });
  }
});

export default router;
