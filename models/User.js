import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["model", "client", "admin"], default: "model" },
  phone: { type: String, trim: true, default: "" },
  avatar: { type: String, default: "" },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });
export const User = mongoose.model("User", userSchema);
