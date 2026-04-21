import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { ModelProfile } from "../models/ModelProfile.js";
import { ClientProfile } from "../models/ClientProfile.js";
import { generateToken } from "../utils/generateToken.js";
import { isMemoryMode } from "../config/runtime.js";
import { createClientProfile, createModelProfile, createUser, findUserByEmail, sanitizeUser } from "../utils/memoryStore.js";

function safeUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone, isVerified: user.isVerified };
}

export async function register(req, res) {
  const { name, email, password, role = "model" } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });

  if (isMemoryMode) {
    const existing = findUserByEmail(email);
    if (existing) return res.status(409).json({ message: "An account with this email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = createUser({ name, email, password: hashedPassword, role });
    if (role === "model") {
      createModelProfile({ userId: user._id, fullName: user.name, city: "", categories: ["Fashion"], experienceLevel: "Beginner", bio: "", isPublished: true });
    }
    if (role === "client") {
      createClientProfile({ userId: user._id, companyName: `${user.name} Studio`, contactPerson: user.name, email: user.email });
    }
    return res.status(201).json({ token: generateToken(user), user: safeUser(user) });
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) return res.status(409).json({ message: "An account with this email already exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashedPassword, role });
  if (role === "model") {
    await ModelProfile.create({ userId: user._id, fullName: user.name, city: "", categories: ["Fashion"], experienceLevel: "Beginner", bio: "", isPublished: true });
  }
  if (role === "client") {
    await ClientProfile.create({ userId: user._id, companyName: `${user.name} Studio`, contactPerson: user.name, email: user.email });
  }
  res.status(201).json({ token: generateToken(user), user: safeUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = isMemoryMode ? findUserByEmail(email) : await User.findOne({ email: email?.toLowerCase().trim() });
  if (!user) return res.status(401).json({ message: "Invalid email or password" });
  const isMatch = await bcrypt.compare(password || "", user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
  res.json({ token: generateToken(user), user: safeUser(user) });
}

export async function me(req, res) { res.json({ user: safeUser(req.user) }); }
export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  res.json({ message: "Password reset requests are enabled in API structure. Connect your email service next for live reset emails." });
}
export async function resetPassword(req, res) {
  const { password } = req.body;
  if (!password || String(password).length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
  const hashedPassword = await bcrypt.hash(password, 10);
  if (isMemoryMode) {
    req.user.password = hashedPassword;
    return res.json({ message: "Password updated successfully" });
  }
  await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });
  res.json({ message: "Password updated successfully" });
}
