import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
dotenv.config();
import express from "express";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

export default app;
