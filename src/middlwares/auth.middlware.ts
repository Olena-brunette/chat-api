import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/token.services.js";
import { HttpStatusCode } from "axios";
import { ResponceMessage } from "../constants.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res
      .status(HttpStatusCode.Unauthorized)
      .json({ error: ResponceMessage.InvalidCreds });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    verifyAccessToken(token);
    next();
  } catch (error: any) {
    if (error.message.includes("expired")) {
      res
        .status(HttpStatusCode.Forbidden)
        .json({ error: ResponceMessage.Expired });
      return;
    }
    res
      .status(HttpStatusCode.Unauthorized)
      .json({ error: ResponceMessage.InvalidCreds });
    return;
  }
};
