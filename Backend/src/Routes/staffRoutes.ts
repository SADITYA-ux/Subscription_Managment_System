import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { createStaff } from "../controller/staff_controller.js";

const router = Router();

router.post("/", authenticate , authorize(["Admin"]), createStaff);

export default router;