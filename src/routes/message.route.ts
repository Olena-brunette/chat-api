import { Router, Request, Response } from "express";
import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import mongoose from "mongoose";
import { HttpStatusCode } from "axios";
import { ResponceMessage } from "../constants.js";

// TODO: remove ts-ignore comments

const router = Router();
// @ts-ignore
router.post("/message", async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id, userId, message } = req.body;
    if (!id || !message || !userId) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ error: ResponceMessage.BadRequest });
    }
    const timestamp = Date.now();
    const newMessage = await Message.create({
      chatId: id,
      sender: userId,
      content: message,
      timestamp,
    });

    const chat = await Chat.findById(id);
    if (!chat) {
      return res
        .status(HttpStatusCode.NotFound)
        .json({ error: ResponceMessage.NotFound });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      id,
      {
        $push: {
          messages: [
            { id: newMessage._id, content: message, timestamp },
          ],
        },
      },
      { new: true }
    );
    if (!updatedChat) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .json({ error: ResponceMessage.InternalServerError });
    }

    await session.commitTransaction();
    res.json(newMessage);
  } catch (error) {
    await session.abortTransaction();
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: ResponceMessage.InternalServerError });
  } finally {
    session.endSession();
  }
});

export default router;
