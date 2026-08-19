import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
    createPayment,
    getAllPayments,
    getPaymentById,
    getPaymentsBySubscription,
    updatePayment
} from "../controller/payment_controller.js";

export const paymentRouter: Router = Router();

paymentRouter.post("/", authenticate, authorize(["Admin", "Staff"]), createPayment);
paymentRouter.get("/", authenticate, authorize(["Admin", "Staff"]), getAllPayments);
paymentRouter.get("/:id", authenticate, authorize(["Admin", "Staff"]), getPaymentById);
paymentRouter.get("/subscription/:subId", authenticate, authorize(["Admin", "Staff"]), getPaymentsBySubscription);
paymentRouter.put("/:id", authenticate, authorize(["Admin", "Staff"]), updatePayment);