import express from "express";
import "dotenv";
import { authRouter } from "./src/Routes/authRoutes.js";
import { staffRouter } from "./src/Routes/staffRoutes.js";
import { planRouter } from "./src/Routes/planRoutes.js";

const app = express();
const PORT = 3000;
app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/staff", staffRouter);
app.use("api/plan" , planRouter);


app.listen( PORT , () =>
{
    console.log(`The server is running at ${PORT}`);
});

