import { ClientProfile } from "../models/ClientProfile.js";
import { isMemoryMode } from "../config/runtime.js";
import { memoryStore } from "../utils/memoryStore.js";
export async function getMyClientProfile(req, res) {
  if (isMemoryMode) return res.json({ item: memoryStore.clientProfiles.find((item) => item.userId === req.user._id) || null });
  const item = await ClientProfile.findOne({ userId: req.user._id });
  res.json({ item });
}
export async function upsertMyClientProfile(req, res) {
  if (isMemoryMode) {
    let item = memoryStore.clientProfiles.find((entry) => entry.userId === req.user._id);
    if (!item) {
      item = { _id: `cli_${Date.now()}`, userId: req.user._id, createdAt: new Date().toISOString() };
      memoryStore.clientProfiles.push(item);
    }
    Object.assign(item, req.body, { userId: req.user._id });
    return res.json({ item });
  }
  const item = await ClientProfile.findOneAndUpdate({ userId: req.user._id }, { ...req.body, userId: req.user._id }, { new: true, upsert: true });
  res.json({ item });
}
