import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then((): void => console.log("Connected to MongoDB"))
  .catch((err: Error): void => console.error("MongoDB connection error:", err));

const PORT = process.env.SERVER || 3001;

app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});
