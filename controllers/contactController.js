import { ContactMessage } from "../models/ContactMessage.js";
import { isMemoryMode } from "../config/runtime.js";
import { memoryStore } from "../utils/memoryStore.js";
export async function submitContactMessage(req, res) {
  const { name, email, message, subject = "" } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: "Name, email and message are required" });
  if (isMemoryMode) {
    const item = { _id: `msg_${Date.now()}`, name, email, subject, message, createdAt: new Date().toISOString() };
    memoryStore.contactMessages.push(item);
    return res.status(201).json({ item, message: 'Message received successfully' });
  }
  const item = await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ item, message: "Message received successfully" });
}
