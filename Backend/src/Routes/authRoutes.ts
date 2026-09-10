import { Router } from "express";
import { createUser, getMe } from "../controller/Register_controller.js";
import { userLogin } from "../controller/Login_controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const authRouter : Router = Router();

authRouter.post("/register", createUser);
authRouter.post("/login", userLogin);
authRouter.get("/me", authenticate, getMe);
