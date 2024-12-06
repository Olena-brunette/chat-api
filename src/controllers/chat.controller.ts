import { HttpStatusCode } from "axios";
import { Request, Response, Router } from "express";
import { ResponceMessage } from "../constants.js";
import { findUserById } from "../repositories/user.repository.js";
import {
  createNewChat,
  deleteChat,
  getChatsByUser,
  updateChat,
} from "../services/chat.service.js";

const router = Router();

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, userId } = req.body;

    if (!firstname || !lastname || !userId) {
      res
        .status(HttpStatusCode.BadRequest)
        .json({ error: ResponceMessage.BadRequest });
      return;
    }

    const user = await findUserById(userId);
    if (!user) {
      res
        .status(HttpStatusCode.NotFound)
        .json({ error: ResponceMessage.NotFound });
      return;
    }

    const title = `${firstname} ${lastname}`;
    const updatedChat = await updateChat(id, title);
    if (!updatedChat) {
      res
        .status(HttpStatusCode.NotFound)
        .json({ error: ResponceMessage.NotFound });
      return;
    }

    res.json(updatedChat);
  } catch (error) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: ResponceMessage.InternalServerError });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, id } = req.body;
    if (!firstname || !lastname) {
      res
        .status(HttpStatusCode.BadRequest)
        .json({ error: ResponceMessage.BadRequest });
      return;
    }

    const title = `${firstname} ${lastname}`;
    const newChat = await createNewChat(title, id);

    res.status(HttpStatusCode.Created).json(newChat);
  } catch (error) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: ResponceMessage.InternalServerError });
  }
});

router.get("/:id/", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { search, lastId } = req.query;
    const chat = await getChatsByUser(
      id,
      lastId ? lastId.toString() : "",
      search ? search.toString() : ""
    );
    if (!chat) {
      res
        .status(HttpStatusCode.NotFound)
        .json({ error: ResponceMessage.NotFound });
      return;
    }

    res.json(chat);
  } catch (error) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: ResponceMessage.InternalServerError });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const chat = await deleteChat(id);
    if (!chat?.message) {
      res
        .status(HttpStatusCode.NotFound)
        .json({ error: ResponceMessage.NotFound });
      return;
    }

    res.json(chat);
  } catch (error) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: ResponceMessage.InternalServerError });
  }
})

export default router;
