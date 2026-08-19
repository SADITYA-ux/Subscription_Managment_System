import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { deleteClient, getAllClients, getClientsById, updateClient } from "../controller/client_controller.js";

export const clientRouter : Router = Router();

clientRouter.get("/" , authenticate , authorize([ "Admin" , "Staff"]) , getAllClients);
clientRouter.get("/:id", authenticate , authorize([ "Admin" , "Staff"]) , getClientsById);
clientRouter.put("/:id" , authenticate , authorize([ "Admin" , "Staff"]) , updateClient);
clientRouter.delete("/:id" , authenticate , authorize(["Admin"]) , deleteClient);