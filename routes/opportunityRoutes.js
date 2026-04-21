import { Router } from "express";
import { createOpportunity, listMyOpportunities, listOpportunities } from "../controllers/opportunityController.js";
import { protect, authorize } from "../middleware/auth.js";
const router = Router();
router.get("/", listOpportunities);
router.get("/mine", protect, authorize("client", "admin"), listMyOpportunities);
router.post("/", protect, authorize("client", "admin"), createOpportunity);
export default router;
