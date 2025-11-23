import express from "express";
import {  createAdmin } from "../controllers/adminController.js";
import { createDoctor } from "../controllers/doctorController.js";
import { auth } from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const router = express.Router();

// Only admin can access these routes

router.post("/create-doctor", auth, adminOnly, createDoctor);
router.post("/create-admin", auth, adminOnly, createAdmin);

export default router;
