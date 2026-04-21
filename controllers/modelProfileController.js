import { ModelProfile } from "../models/ModelProfile.js";
import { isMemoryMode } from "../config/runtime.js";
import { memoryStore } from "../utils/memoryStore.js";
export async function listProfiles(req, res) {
  const { q = "", city = "" } = req.query;
  if (isMemoryMode) {
    let items = memoryStore.modelProfiles.filter((item) => item.isPublished);
    if (q) items = items.filter((item) => item.fullName?.toLowerCase().includes(String(q).toLowerCase()));
    if (city) items = items.filter((item) => item.city?.toLowerCase().includes(String(city).toLowerCase()));
    return res.json({ items: items.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 60) });
  }
  const filters = { isPublished: true };
  if (q) filters.fullName = { $regex: q, $options: "i" };
  if (city) filters.city = { $regex: city, $options: "i" };
  const items = await ModelProfile.find(filters).sort({ createdAt: -1 }).limit(60).lean();
  res.json({ items });
}
export async function getMyProfile(req, res) {
  if (isMemoryMode) return res.json({ item: memoryStore.modelProfiles.find((item) => item.userId === req.user._id) || null });
  const item = await ModelProfile.findOne({ userId: req.user._id });
  res.json({ item });
}
export async function upsertMyProfile(req, res) {
  const payload = req.body;
  if (isMemoryMode) {
    let item = memoryStore.modelProfiles.find((entry) => entry.userId === req.user._id);
    if (!item) {
      item = { _id: `mod_${Date.now()}`, userId: req.user._id, createdAt: new Date().toISOString() };
      memoryStore.modelProfiles.push(item);
    }
    Object.assign(item, payload, { userId: req.user._id, fullName: payload.fullName || req.user.name });
    return res.json({ item });
  }
  const item = await ModelProfile.findOneAndUpdate({ userId: req.user._id }, { ...payload, userId: req.user._id, fullName: payload.fullName || req.user.name }, { new: true, upsert: true });
  res.json({ item });
}
