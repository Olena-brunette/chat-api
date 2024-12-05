import { HttpStatusCode } from "axios";
import { Request, Response, Router } from "express";
import { registerUser } from "../services/user.service.js";
import { ResponceMessage } from "../constants.js";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      res
        .status(HttpStatusCode.BadRequest)
        .json({ error: ResponceMessage.BadRequest });
      return;
    }

    const newUser = await registerUser(login, password);

    res.status(HttpStatusCode.Created).json(newUser);
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

export default router;
