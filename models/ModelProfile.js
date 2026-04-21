import mongoose from "mongoose";
const modelProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  fullName: { type: String, required: true, trim: true },
  age: Number,
  gender: String,
  heightCm: Number,
  weightKg: Number,
  city: String,
  state: String,
  country: { type: String, default: "India" },
  languages: [{ type: String }],
  skills: [{ type: String }],
  categories: [{ type: String }],
  experienceLevel: { type: String, default: "Beginner" },
  bio: { type: String, default: "" },
  profileImageUrl: { type: String, default: "" },
  portfolioImages: [{ type: String }],
  instagram: { type: String, default: "" },
  measurements: { type: String, default: "" },
  availability: { type: String, default: "Available" },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });
export const ModelProfile = mongoose.model("ModelProfile", modelProfileSchema);
