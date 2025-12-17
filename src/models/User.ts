import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  image?: string;
  branch: string;
  year: number;
  reputationScore: number;
  skills: string[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false }, 
    image: { type: String },
    branch: { type: String, required: true },
    year: { type: Number, required: true },
    reputationScore: { type: Number, default: 50 }, 
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;