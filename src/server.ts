import express, { NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import registerUserEndpoint from "./controllers/user.controller.js";
import registerChatEndpoint from "./controllers/chat.controller.js";
import registerMessageEndpoint from "./controllers/message.controller.js";
import authController from "./controllers/auth.controller.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use("/api/users", registerUserEndpoint);
app.use("/api/auth", authController);
app.use("/api/chats", registerChatEndpoint);
app.use("/api/messages", registerMessageEndpoint);

app.get("/", (req, res) => {
  res.send("Hello, this is your Express.js server with MongoDB.");
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  app.get("/", (req, res) => {
    res.send("Hello, this is your Express.js server with MongoDB.");
  });

  throw new Error("No MONGODB_URI variable in .env file");
}
mongoose
  .connect(MONGODB_URI)
  .then((): void => console.log("Connected to MongoDB"))
  .catch((err: Error): void => console.error("MongoDB connection error:", err));

const PORT = process.env.SERVER || 3001;

app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});
