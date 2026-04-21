import { Application } from "../models/Application.js";
import { isMemoryMode } from "../config/runtime.js";
import { memoryStore } from "../utils/memoryStore.js";
export async function applyToOpportunity(req, res) {
  const { opportunityId, coverMessage = "" } = req.body;
  if (!opportunityId) return res.status(400).json({ message: "opportunityId is required" });
  if (isMemoryMode) {
    const item = { _id: `app_${Date.now()}`, modelId: req.user._id, opportunityId, coverMessage, createdAt: new Date().toISOString() };
    memoryStore.applications.push(item);
    return res.status(201).json({ item });
  }
  const item = await Application.create({ modelId: req.user._id, opportunityId, coverMessage });
  res.status(201).json({ item });
}
export async function getMyApplications(req, res) {
  if (isMemoryMode) return res.json({ items: memoryStore.applications.filter((item) => item.modelId === req.user._id).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))) });
  const items = await Application.find({ modelId: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({ items });
}
