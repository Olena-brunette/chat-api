import { Router, Request, Response } from "express";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import { HttpStatusCode } from "axios";
import { ResponceMessage } from "../constants.js";

// TODO: remove ts-ignore comments

const router = Router();

// @ts-ignore
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, userId } = req.body;

    if (!firstname || !lastname || !userId) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ error: ResponceMessage.BadRequest });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(HttpStatusCode.NotFound)
        .json({ error: ResponceMessage.NotFound });
    }

    const existingChat = await Chat.findOne({ _id: id });
    if (!existingChat) {
      return res
        .status(HttpStatusCode.NotFound)
        .json({ error: ResponceMessage.NotFound });
    }
    const title = `${firstname} ${lastname}`;
    const updatedChat = await Chat.findByIdAndUpdate(
      id,
      { title, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedChat) {
      return res
        .status(HttpStatusCode.NotFound)
        .json({ error: ResponceMessage.NotFound });
    }

    res.json(updatedChat);
  } catch (error) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: ResponceMessage.InternalServerError });
  }
});

// @ts-ignore
router.post("/", async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, id } = req.body;

    if (!firstname || !lastname || !id) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ error: ResponceMessage.BadRequest });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(HttpStatusCode.NotFound)
        .json({ error: ResponceMessage.NotFound });
    }

    const title = `${firstname} ${lastname}`;

    const chat = {
      title: `${firstname} ${lastname}`,
      owner: id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      replies: [],
    };

    await Chat.create(chat);
    res.status(HttpStatusCode.Created).json({ title });
  } catch (error) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: ResponceMessage.InternalServerError });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let chats;
    if (search) {
      chats = await Chat.find({ title: { $regex: search, $options: "i" } });
    } else {
      chats = await Chat.find();
    }
    res.json(chats);
  } catch (error) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: ResponceMessage.InternalServerError });
  }
});

export default router;
