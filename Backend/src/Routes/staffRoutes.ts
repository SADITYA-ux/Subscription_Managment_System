import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { createStaff } from "../controller/staff_controller.js";

export const staffRouter: Router = Router();

staffRouter.post("/", authenticate , authorize(["Admin"]), createStaff);

