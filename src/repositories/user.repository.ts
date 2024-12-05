import mongoose from "mongoose";
import User from "../models/user.model.js";
import { DEFAULT_CHATS } from "../constants.js";
import Chat from "../models/chat.model.js";

export const findUserByLogin = async (login: string) => {
  return await User.findOne({ login });
};

export const findUserById = async (id: string) => {
  return await User.findById(id);
};

export const createUser = async (login: string, hashedPassword: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newUser = new User({
      login,
      password: hashedPassword,
      createdAt: Date.now(),
    });
    await newUser.save({ session });

    const productPromises = DEFAULT_CHATS.map((chat) =>
      new Chat({
        title: chat,
        owner: newUser._id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastMessage: null,
      }).save({ session })
    );
    await Promise.all(productPromises);

    await session.commitTransaction();

    return newUser;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};
