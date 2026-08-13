import { Router } from "express";
import { createUser } from "../controller/Register_controller.js";
import { userLogin } from "../controller/Login_controller.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", userLogin);

export default router;