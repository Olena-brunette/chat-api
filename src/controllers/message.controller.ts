import { HttpStatusCode } from "axios";
import { Request, Response, Router } from "express";
import { ResponceMessage } from "../constants.js";
import {
  createMessage,
  getAllMessages,
  getRandomReply,
} from "../services/message.service.js";

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
    // TODO: mplement sokets
    await createMessage({ id, userId, message })
      .then(async (data) => {
        await getRandomReply()
          .then(async (reply) => {
            await createMessage({
              id,
              message: reply.data[0].content,
            });
          })
          .catch(() => {
            // console.log("777", err);
          });

        res.status(HttpStatusCode.Created).json(data);
      })
      .catch(() => {
        res
          .status(HttpStatusCode.NotFound)
          .json({ error: ResponceMessage.NotFound });
      });
  } catch (error) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: ResponceMessage.InternalServerError });
  }
});

router.get("/:chatId", async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      res
        .status(HttpStatusCode.BadRequest)
        .json({ error: ResponceMessage.BadRequest });
      return;
    }
    await getAllMessages(chatId)
      .then((data) => {
        res.status(HttpStatusCode.Ok).json(data);
      })
      .catch(() => {
        res
          .status(HttpStatusCode.NotFound)
          .json({ error: ResponceMessage.NotFound });
        return;
      });
  } catch (error) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: ResponceMessage.InternalServerError });
    return;
  }
});

export default router;
