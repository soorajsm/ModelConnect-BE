import mongoose from "mongoose";
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: "" },
  company: { type: String, default: "" },
  quote: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });
export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
