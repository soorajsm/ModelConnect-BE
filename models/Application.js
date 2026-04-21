import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema({
  modelId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity", required: true },
  coverMessage: { type: String, default: "" },
  status: { type: String, enum: ["submitted", "shortlisted", "rejected"], default: "submitted" }
}, { timestamps: true });
applicationSchema.index({ modelId: 1, opportunityId: 1 }, { unique: true });
export const Application = mongoose.model("Application", applicationSchema);
