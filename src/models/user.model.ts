import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  login: string;
  createdAt: number;
  password: string;
}

const UserSchema: Schema = new Schema({
  login: { type: String, required: true, unique: true },
  createdAt: { type: Number, default: Date.now },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
