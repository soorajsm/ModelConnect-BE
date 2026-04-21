import { Opportunity } from "../models/Opportunity.js";
import { isMemoryMode } from "../config/runtime.js";
import { memoryStore } from "../utils/memoryStore.js";
export async function listOpportunities(req, res) {
  const { q = "", location = "" } = req.query;
  if (isMemoryMode) {
    let items = memoryStore.opportunities.filter((item) => item.status === 'open');
    if (q) items = items.filter((item) => [item.title, item.category].some((value) => String(value || '').toLowerCase().includes(String(q).toLowerCase())));
    if (location) items = items.filter((item) => String(item.location || '').toLowerCase().includes(String(location).toLowerCase()));
    return res.json({ items: items.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))).slice(0,40) });
  }
  const filters = { status: "open" };
  if (q) filters.$or = [{ title: { $regex: q, $options: "i" } }, { category: { $regex: q, $options: "i" } }];
  if (location) filters.location = { $regex: location, $options: "i" };
  const items = await Opportunity.find(filters).sort({ createdAt: -1 }).limit(40).lean();
  res.json({ items });
}
export async function createOpportunity(req, res) {
  if (isMemoryMode) {
    const item = { _id: `opp_${Date.now()}`, ...req.body, createdBy: req.user._id, createdAt: new Date().toISOString(), status: req.body.status || 'open' };
    memoryStore.opportunities.push(item);
    return res.status(201).json({ item });
  }
  const item = await Opportunity.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ item });
}
export async function listMyOpportunities(req, res) {
  if (isMemoryMode) return res.json({ items: memoryStore.opportunities.filter((item) => item.createdBy === req.user._id).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))) });
  const items = await Opportunity.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({ items });
}
