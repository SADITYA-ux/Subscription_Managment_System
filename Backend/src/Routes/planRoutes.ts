import { Router } from "express";
import { createPlan, deletePlan, getPlan, getPlanById, updatePlan, getInactivePlans, restorePlan } from "../controller/Plan_controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

export const planRouter: Router = Router();

planRouter.get("/", getPlan);
planRouter.get("/inactive", authenticate, authorize(["Admin"]), getInactivePlans);
planRouter.get("/:id", getPlanById);
planRouter.post("/", authenticate, authorize(["Admin"]), createPlan);
planRouter.put("/:id", authenticate, authorize(["Admin"]), updatePlan);
planRouter.delete("/:id", authenticate, authorize(["Admin"]), deletePlan);
planRouter.put("/:id/restore", authenticate, authorize(["Admin"]), restorePlan);