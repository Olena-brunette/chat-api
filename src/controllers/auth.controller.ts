import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../services/token.services.js";
import { HttpStatusCode } from "axios";
import { ResponceMessage } from "../constants.js";
import {
  registerUser,
  validateUserById,
  validateUserByName,
} from "../services/user.service.js";

const router = Router();

router.post("/registration", async (req: Request, res: Response): Promise<void> => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      res
        .status(HttpStatusCode.BadRequest)
        .json({ error: ResponceMessage.BadRequest });
      return;
    }

    await registerUser(login, password)
      .then((data) => {
        const accessToken = generateAccessToken(data.id as string);
        const refreshToken = generateRefreshToken(data.id as string);
        res.status(HttpStatusCode.Created).json({
          accessToken,
          refreshToken,
          user: {
            login: data.login,
            id: data.id,
          },
        });
      })
      .catch(() => {
        res
          .status(HttpStatusCode.Conflict)
          .json({ error: ResponceMessage.Conflict });
      });
  } catch (err: any) {
    if (err.message === "User already exists") {
      res
        .status(HttpStatusCode.Conflict)
        .json({ error: ResponceMessage.Conflict });
      return;
    }

    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: ResponceMessage.InternalServerError });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (!login || !password) {
    res
      .status(HttpStatusCode.BadRequest)
      .json({ error: ResponceMessage.BadRequest });
    return;
  }

  const user = await validateUserByName(login);
  if (!user) {
    res
      .status(HttpStatusCode.NotFound)
      .json({ error: ResponceMessage.NotFound });
    return;
  }
  const passwordMatch = await bcrypt.compare(password, user?.password);
  if (!passwordMatch) {
    res
      .status(HttpStatusCode.Forbidden)
      .json({ error: ResponceMessage.InvalidCreds });
    return;
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.json({
    accessToken,
    refreshToken,
    user: { login: user.login, id: user.id },
  });
});

router.post("/refresh", async(req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    res
      .status(HttpStatusCode.BadRequest)
      .json({ error: ResponceMessage.BadRequest });
    return;
  }

  try {
    const payload: any = verifyRefreshToken(token);
    const user = await validateUserById(payload.userId);

    if (!user) {
      res
        .status(HttpStatusCode.NotFound)
        .json({ error: ResponceMessage.NotFound });
      return;
    }
    // @ts-ignore
    const newAccessToken = generateAccessToken(user._id);
    // @ts-ignore

    res.json({ accessToken: newAccessToken });
  } catch (error: any) {
    res
      .status(HttpStatusCode.Unauthorized)
      .json({ error: error.message || ResponceMessage.InvalidCreds });
  }
});

export default router;
