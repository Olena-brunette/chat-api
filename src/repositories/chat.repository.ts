import Chat from "../models/chat.model.js";

const LIMIT = 50;

export const findChatById = async (id: string) => {
  return await Chat.findOne({ _id: id });
};

export const updateChatTitle = async (id: string, title: string) => {
  return await Chat.findByIdAndUpdate(
    id,
    { title, updatedAt: Date.now() },
    { new: true }
  );
};

export const updateChatLastMessage = async (
  chatId: string,
  messageId: string,
  content: string,
  timestamp: number
) => {
  return await Chat.findByIdAndUpdate(
    chatId,
    {
      lastMessage: {
        id: messageId,
        content,
        timestamp,
      },
    },
    { new: true }
  );
};

export const createChat = async (title: string, userId: string) => {
  const newChat = new Chat({
    title,
    owner: userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastMessage: null,
  });
  return await newChat.save();
};

export const getChatsByUserId = async (
  userId: string,
  lastId: string,
  search?: string
) => {
  const query = lastId ? { _id: { $lt: lastId } } : {};
  const options = { LIMIT, sort: { _id: -1 } };
  const searchQuery = search
    ? { title: { $regex: search, $options: "i" } }
    : {};

  return await Chat.find(
    {
      ...query,
      ...searchQuery,
      owner: userId,
    },
    null,
    options
  );
};


export const removeChat = async (id: string) => {
  return await Chat.findByIdAndDelete(id);
}