import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  title: string;
  owner: mongoose.Types.ObjectId;
  createdAt: number;
  messages: {
    id: mongoose.Types.ObjectId;
    content: string;
    timestamp: number;
  }[];
  replies: {
    id: mongoose.Types.ObjectId;
    content: string;
    timestamp: number;
  }[];
  updatedAt: number;
}

const ChatSchema: Schema = new Schema({
  title: { type: String, required: true},
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Number },
  updatedAt: { type: Number },
  messages: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
      content: { type: String, required: true },
      timestamp: { type: Number, required: true },
      _id: false,

    },
  ],
  replies: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Reply" },
      content: { type: String, required: true },
      timestamp: { type: Number, required: true },
      _id: false,

    },
  ],
});

export default mongoose.model<IChat>("Chat", ChatSchema);
