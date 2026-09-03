import express from "express";
import cors from "cors";
import "dotenv";
import { authRouter } from "./src/Routes/authRoutes.js";
import { staffRouter } from "./src/Routes/staffRoutes.js";
import { planRouter } from "./src/Routes/planRoutes.js";
import { subscriptionRouter } from "./src/Routes/subscriptionRoutes.js";
import { paymentRouter } from "./src/Routes/paymentRoutes.js";
import { clientRouter } from "./src/Routes/clientRoutes.js";

const app = express();
const PORT = 3000;
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use("/api/auth", authRouter);
app.use("/api/staff", staffRouter);
app.use("/api/plans" , planRouter);
app.use("/api/subscriptions", subscriptionRouter);
app.use("/api/payments" , paymentRouter);
app.use("/api/clients", clientRouter);


app.listen( PORT , () =>
{
    console.log(`The server is running at ${PORT}`);
});

