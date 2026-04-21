import { Router } from "express";
import { getMyClientProfile, upsertMyClientProfile } from "../controllers/clientProfileController.js";
import { protect, authorize } from "../middleware/auth.js";
const router = Router();
router.get("/me", protect, authorize("client", "admin"), getMyClientProfile);
router.post("/me", protect, authorize("client", "admin"), upsertMyClientProfile);
export default router;
