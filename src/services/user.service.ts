import bcrypt from "bcrypt";
import {
  findUserByLogin,
  createUser,
} from "../repositories/user.repository.js";
import { ResponceMessage } from "../constants.js";

export const registerUser = async (login: string, password: string) => {
  const existingUser = await findUserByLogin(login);
  if (existingUser) {
    throw new Error(ResponceMessage.Conflict);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await createUser(login, hashedPassword);
  return { login: newUser.login, createdAt: newUser.createdAt };
};
