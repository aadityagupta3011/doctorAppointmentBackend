import express from "express";
import { createDoctor, createAdmin } from "../controllers/adminController.js";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

// Only admin can access these routes
router.post("/create-doctor", auth, adminOnly, createDoctor);
router.post("/create-admin", auth, adminOnly, createAdmin);

export default router;
