import axios from "axios";
import https from "https";
import { ResponceMessage } from "../constants.js";
import { getMessages, registerMessage } from "../repositories/message.repository.js";

const RESPONSE_TIMEOUT = 3000;

export const createMessage = async ({
  id,
  userId,
  message,
}: {
  id: string;
  userId?: string;
  message: string;
}) => {

  const newMessage = await registerMessage(id, message, userId);
  if (!newMessage) {
    throw new Error(ResponceMessage.NotCreated);
  }
  return newMessage;
};

export const getRandomReply = async () => {
  const url = "https://api.quotable.io/quotes/random";

  const agent = new https.Agent({
    // Tempoprarily allow insecure requests because the of getting CERT_HAS_EXPIRED error
    rejectUnauthorized: false,
  });

  return await axios.get(url, { timeout: RESPONSE_TIMEOUT, httpsAgent: agent });
};


export const getAllMessages = async (chatId: string) => {  
  const messages = await getMessages(chatId);
  if (!messages) {
    throw new Error(ResponceMessage.NotFound);
  }
  return messages;
}