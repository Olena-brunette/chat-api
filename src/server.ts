import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
  res.send("Hello, this is your Express.js server with MongoDB.");
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {app.get("/", (req, res) => {
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
