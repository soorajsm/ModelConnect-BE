import { Router } from "express";
import { getMyProfile, listProfiles, upsertMyProfile } from "../controllers/modelProfileController.js";
import { protect, authorize } from "../middleware/auth.js";
const router = Router();
router.get("/", listProfiles);
router.get("/me", protect, authorize("model", "admin"), getMyProfile);
router.post("/me", protect, authorize("model", "admin"), upsertMyProfile);
export default router;
