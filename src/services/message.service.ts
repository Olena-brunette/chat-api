import { ResponceMessage } from "../constants.js";
import { registerMessage } from "../repositories/message.repository.js";

export const createMessage = async (
  chatId: string,
  sender: string,
  content: string
) => {
  const message = await registerMessage(chatId, sender, content);
  if (!message) {
    throw new Error(ResponceMessage.NotCreated);
  }
  return message;
};
