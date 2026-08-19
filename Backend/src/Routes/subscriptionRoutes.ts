import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { createSubs, deleteSubs, editSubs, getAllSubs, getSubsByClient, getSubsById, updateSubs } from "../controller/subscription_controller.js";

export const subscriptionRouter : Router = Router();

subscriptionRouter.post("/", authenticate , authorize(["Admin","Staff"]) , createSubs);
subscriptionRouter.get("/" , authenticate ,authorize(["Admin","Staff"]) , getAllSubs);
subscriptionRouter.get("/:id" , authenticate , authorize(["Admin","Staff"]) , getSubsById);
subscriptionRouter.put("/:id", authenticate , authorize(["Admin","Staff"]) , updateSubs);
subscriptionRouter.get("/client/:id",authenticate, getSubsByClient);
subscriptionRouter.delete("/:id" , authenticate , authorize(["Admin"]) , deleteSubs);
subscriptionRouter.put("/edit/:id" , authenticate , authorize(["Admin"]) , editSubs);

