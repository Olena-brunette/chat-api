import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  id: string;
  login: string;
  createdAt: number;
  password: string;
}

const UserSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  createdAt: { type: Number, default: Date.now },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
