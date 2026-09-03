import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { deleteClient, getAllClients, getClientsById, getInactiveClient, restoreClient, updateClient } from "../controller/client_controller.js";

export const clientRouter : Router = Router();

clientRouter.get("/" , authenticate , authorize([ "Admin" , "Staff"]) , getAllClients);
clientRouter.get("/inactive" , authenticate , authorize(["Admin"]), getInactiveClient);
clientRouter.put("/restore/:id" , authenticate , authorize(["Admin"]) , restoreClient);
clientRouter.get("/:id", authenticate , authorize([ "Admin" , "Staff"]) , getClientsById);
clientRouter.put("/:id" , authenticate , authorize([ "Admin" , "Staff"]) , updateClient);
clientRouter.delete("/:id" , authenticate , authorize(["Admin"]) , deleteClient);