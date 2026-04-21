import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { isMemoryMode } from "../config/runtime.js";
import { findUserById } from "../utils/memoryStore.js";

export async function protect(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = isMemoryMode ? findUserById(decoded.sub) : await User.findById(decoded.sub).select("-password");
    if (!user) return res.status(401).json({ message: "User no longer exists" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
}
