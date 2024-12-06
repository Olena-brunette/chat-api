import bcrypt from "bcrypt";
import {
  findUserByLogin,
  createUser,
  findUserById,
} from "../repositories/user.repository.js";
import { ResponceMessage } from "../constants.js";
import { verifyRefreshToken } from "./token.services.js";

export const registerUser = async (login: string, password: string) => {

  const existingUser = await findUserByLogin(login);
  if (existingUser) {
    throw new Error(ResponceMessage.Conflict);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await createUser(login, hashedPassword);
  return { login: newUser.login, createdAt: newUser.createdAt, id: newUser._id };
};


export const validateUserByName = async (login: string) => {
  const user = await findUserByLogin(login)
  if (!user) {
    throw new Error(ResponceMessage.NotFound);
  }
    
  return user;
  }

  export const validateUserById = async (id: string) => {
    const user = await findUserById(id)
    if (!user) {
      throw new Error(ResponceMessage.NotFound);
    }
      
    return user;
    }

