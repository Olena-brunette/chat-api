import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  title: string;
  owner: mongoose.Types.ObjectId;
  createdAt: number;
  lastMessage: {
    id: mongoose.Types.ObjectId;
    content: string;
    timestamp: number;
  };
  updatedAt: number;
}

const ChatSchema: Schema = new Schema({
  title: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Number },
  updatedAt: { type: Number },
  lastMessage: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    content: { type: String },
    timestamp: { type: Number},
    _id: false,
  },
});

export default mongoose.model<IChat>("Chat", ChatSchema);
