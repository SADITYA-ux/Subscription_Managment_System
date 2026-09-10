import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { createStaff, deactivateStaff, getAllStaff, updateStaff } from "../controller/staff_controller.js";

export const staffRouter: Router = Router();

staffRouter.post("/", authenticate , authorize(["Admin"]), createStaff);
staffRouter.get("/", authenticate , authorize(["Admin"]) , getAllStaff);
staffRouter.put("/:id", authenticate, authorize(["Admin"]), updateStaff);
staffRouter.put("/:id" , authenticate , authorize(["Admin"]) , deactivateStaff);

