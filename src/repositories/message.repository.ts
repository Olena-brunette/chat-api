import mongoose from "mongoose";
import Message from "../models/message.model.js";
import { updateChatLastMessage } from "./chat.repository.js";

export const registerUserMessage = (
  chatId: string,
  content: string,
  userId?: string
) => {
  const newMessage = new Message({
    chatId,
    sender: userId,
    content,
    timestamp: Date.now(),
  });
  return newMessage.save();
};

export const registerMessage = async (
  chatId: string,
  content: string,
  userId?: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newMessage = await registerUserMessage(chatId, content, userId);

    await updateChatLastMessage(
      chatId,
      newMessage._id as string,
      content,
      newMessage.timestamp
    );

    await session.commitTransaction();
    return newMessage;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
