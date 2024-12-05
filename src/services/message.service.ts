import axios from "axios";
import https from "https";
import { ResponceMessage } from "../constants.js";
import { registerMessage } from "../repositories/message.repository.js";

export const createMessage = async ({
  id,
  userId,
  message,
}: {
  id: string;
  userId?: string;
  message: string;
}) => {
  console.log("createMessage", id, userId, message);
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

  return await axios.get(url, { timeout: 3000, httpsAgent: agent });
};
