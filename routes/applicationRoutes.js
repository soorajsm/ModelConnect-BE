import { Router } from "express";
import { applyToOpportunity, getMyApplications } from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";
const router = Router();
router.get("/mine", protect, authorize("model", "admin"), getMyApplications);
router.post("/", protect, authorize("model", "admin"), applyToOpportunity);
export default router;
