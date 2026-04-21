import mongoose from "mongoose";
const clientProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  companyName: { type: String, required: true, trim: true },
  contactPerson: { type: String, default: "" },
  businessType: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  website: { type: String, default: "" },
  location: { type: String, default: "" },
  description: { type: String, default: "" },
  logo: { type: String, default: "" }
}, { timestamps: true });
export const ClientProfile = mongoose.model("ClientProfile", clientProfileSchema);
