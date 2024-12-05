import mongoose from "mongoose";
import Message from "../models/message.model.js";
import { updateChatLastMessage } from "./chat.repository.js";

export const registerUserMessage = (
  chatId: string,
  userId: string,
  content: string
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
  userId: string,
  content: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newMessage = await registerUserMessage(chatId, userId, content);

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
