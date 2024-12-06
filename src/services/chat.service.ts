import { ResponceMessage } from "../constants.js";
import {
  createChat,
  findChatById,
  getChatsByUserId,
  removeChat,
  updateChatTitle,
} from "../repositories/chat.repository.js";

export const updateChat = async (id: string, title: string) => {
  const chatToUpdate = await findChatById(id);
  if (!chatToUpdate) {
    throw new Error(ResponceMessage.NotFound);
  }

  const updatedChat = await updateChatTitle(id, title);
  if (!updatedChat) {
    throw new Error(ResponceMessage.NotUpdated);
  }
  return updatedChat;
};

export const createNewChat = async (title: string, userId: string) => {
  return await createChat(title, userId);
};

export const getChatsByUser = async (
  userId: string,
  lastId: string,
  search?: string
) => {
  return await getChatsByUserId(userId, lastId, search);
};


export const deleteChat = async (id: string) => {
  const chatToDelete = await findChatById(id);
  if (!chatToDelete) {
    throw new Error(ResponceMessage.NotFound);
  }

  const deletedChat = await removeChat(id);
  if (!deletedChat) {
    throw new Error();
  }
  return {message: ResponceMessage.Deleted};
}