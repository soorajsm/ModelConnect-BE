import { PortfolioItem } from "../models/PortfolioItem.js";
import { isMemoryMode } from "../config/runtime.js";
import { memoryStore } from "../utils/memoryStore.js";
export async function listMyPortfolio(req, res) {
  if (isMemoryMode) return res.json({ items: memoryStore.portfolio.filter((item) => item.userId === req.user._id).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))) });
  const items = await PortfolioItem.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({ items });
}
export async function createPortfolioItem(req, res) {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
  if (!imageUrl) return res.status(400).json({ message: "Image is required" });
  if (isMemoryMode) {
    const item = { _id: `por_${Date.now()}`, userId: req.user._id, imageUrl, caption: req.body.caption || "", category: req.body.category || "", createdAt: new Date().toISOString() };
    memoryStore.portfolio.push(item);
    return res.status(201).json({ item });
  }
  const item = await PortfolioItem.create({ userId: req.user._id, imageUrl, caption: req.body.caption || "", category: req.body.category || "" });
  res.status(201).json({ item });
}
export async function deletePortfolioItem(req, res) {
  if (isMemoryMode) {
    const idx = memoryStore.portfolio.findIndex((item) => item._id === req.params.id && item.userId === req.user._id);
    if (idx >= 0) memoryStore.portfolio.splice(idx, 1);
    return res.json({ message: 'Portfolio item deleted' });
  }
  await PortfolioItem.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.json({ message: "Portfolio item deleted" });
}
