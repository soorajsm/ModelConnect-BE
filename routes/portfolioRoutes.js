import { Router } from "express";
import { createPortfolioItem, deletePortfolioItem, listMyPortfolio } from "../controllers/portfolioController.js";
import { protect, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
const router = Router();
router.get("/mine", protect, authorize("model", "admin"), listMyPortfolio);
router.post("/", protect, authorize("model", "admin"), upload.single("image"), createPortfolioItem);
router.delete("/:id", protect, authorize("model", "admin"), deletePortfolioItem);
export default router;
