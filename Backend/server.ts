import express from "express";
import "dotenv";
import authRoutes from "./src/Routes/authRoutes.js";
import staffRoutes from "./src/Routes/staffRoutes.js";

const app = express();
const PORT = 3000;
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);

app.listen( PORT , () =>
{
    console.log(`The server is running at ${PORT}`);
});

