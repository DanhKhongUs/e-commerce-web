import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  id: string;
  email: string;
  name: string;
  image: string;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

// Tránh lỗi “Cannot overwrite model once compiled”
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
