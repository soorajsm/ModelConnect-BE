import mongoose from "mongoose";
const portfolioItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String, required: true },
  caption: { type: String, default: "" },
  category: { type: String, default: "" }
}, { timestamps: true });
export const PortfolioItem = mongoose.model("PortfolioItem", portfolioItemSchema);
