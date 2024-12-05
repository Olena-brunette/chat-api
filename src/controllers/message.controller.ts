import { HttpStatusCode } from "axios";
import { Request, Response, Router } from "express";
import { ResponceMessage } from "../constants.js";
import { createMessage } from "../services/message.service.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { id, userId, message } = req.body;
    if (!id || !message || !userId) {
      res
        .status(HttpStatusCode.BadRequest)
        .json({ error: ResponceMessage.BadRequest });
      return;
    }

    const newMessage = await createMessage(id, userId, message);

    res.status(HttpStatusCode.Created).json(newMessage);
  } catch (error) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: ResponceMessage.InternalServerError });
  }
});

export default router;
