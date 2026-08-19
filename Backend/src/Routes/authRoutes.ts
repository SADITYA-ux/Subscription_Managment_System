import { Router } from "express";
import { createUser } from "../controller/Register_controller.js";
import { userLogin } from "../controller/Login_controller.js";

export const authRouter : Router = Router();

authRouter.post("/register", createUser);
authRouter.post("/login", userLogin);
