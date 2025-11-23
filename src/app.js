import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>{
  res.send("App is Working");
});
app.use("/api/auth",authRoutes);
export default app;