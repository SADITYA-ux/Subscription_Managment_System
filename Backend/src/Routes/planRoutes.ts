import { Router } from "express";
import { createPlan, deletePlan, getPlan, getPlanById, updatePlan } from "../controller/Plan_controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

export const planRouter : Router = Router();

planRouter.get("/", getPlan);
planRouter.get("/:id", getPlanById);
planRouter.put("/:id", authenticate , authorize(["Admin"]), createPlan);
planRouter.put("/:id", authenticate , authorize(["Admin"]), updatePlan);
planRouter.put("/:id", authenticate , authorize(["Admin"]), deletePlan);