import mongoose, { Schema, Document } from 'mongoose';

export interface IReply extends Document {
  chatId: mongoose.Types.ObjectId;
  reply: string;
  date: Date;
}

const ReplySchema: Schema = new Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  reply: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<IReply>('Reply', ReplySchema);
