import "./config/env.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import modelProfileRoutes from "./routes/modelProfileRoutes.js";
import clientProfileRoutes from "./routes/clientProfileRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import learningRoutes from "./routes/learningRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  await connectDB();
} catch (error) {
  console.error("Failed to start backend:", error.message);
  process.exit(1);
}

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:8081,http://localhost:8080,http://127.0.0.1:8081,http://127.0.0.1:8080")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => { res.json({ ok: true, message: "ModelConnect API is running" }); });
app.use("/api/auth", authRoutes);
app.use("/api/model-profiles", modelProfileRoutes);
app.use("/api/client-profiles", clientProfileRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/learning", learningRoutes);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
const server = app.listen(port, () => { console.log(`Server listening on http://localhost:${port}`); });
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Stop the other process or change PORT in backend/.env.`);
  } else {
    console.error("Server failed:", error.message);
  }
  process.exit(1);
});
