import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { createSubs, deleteSubs, editSubs, extendSubs, getAllSubs, getMySubs, getSubsByClient, getSubsById, inactiveSubs, restoreSubs, updateSubs } from "../controller/subscription_controller.js";

export const subscriptionRouter : Router = Router();

subscriptionRouter.post("/", authenticate , authorize(["Admin","Staff"]) , createSubs);
subscriptionRouter.get("/" , authenticate ,authorize(["Admin","Staff"]) , getAllSubs);
subscriptionRouter.get("/inactive", authenticate, authorize(["Admin"]), inactiveSubs);
subscriptionRouter.get("/:id" , authenticate , authorize(["Admin","Staff"]) , getSubsById);
subscriptionRouter.put("/:id", authenticate , authorize(["Admin","Staff"]) , updateSubs);
subscriptionRouter.get("/client/:id",authenticate, getSubsByClient);
subscriptionRouter.delete("/:id" , authenticate , authorize(["Admin"]) , deleteSubs);
subscriptionRouter.put("/:id/extend", authenticate, authorize(["Admin", "Staff"]), extendSubs);
subscriptionRouter.put("/:id/restore", authenticate, authorize(["Admin"]), restoreSubs);
subscriptionRouter.get("/mine", authenticate, authorize(["Client"]), getMySubs);
