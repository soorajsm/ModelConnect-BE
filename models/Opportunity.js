import mongoose from "mongoose";
const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, default: "" },
  category: { type: String, default: "" },
  description: { type: String, required: true },
  requirements: { type: String, default: "" },
  budgetMin: Number,
  budgetMax: Number,
  currency: { type: String, default: "INR" },
  location: { type: String, default: "" },
  projectType: { type: String, default: "photoshoot" },
  applicationDeadline: Date,
  shootDate: Date,
  status: { type: String, enum: ["draft", "open", "closed"], default: "open" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
export const Opportunity = mongoose.model("Opportunity", opportunitySchema);
