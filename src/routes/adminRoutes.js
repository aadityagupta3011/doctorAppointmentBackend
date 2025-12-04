import express from "express";
import {  createAdmin,getUnverifiedDoctors,verifyDoctor, deleteDoctor } from "../controllers/adminController.js";
import { createDoctor, getAllDoctors, } from "../controllers/doctorController.js";
import { auth } from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/adminOnly.js";


const router = express.Router();

// Only admin can access these routes

router.post("/create-doctor", auth, adminOnly, createDoctor);
router.post("/create-admin", auth, adminOnly, createAdmin);
router.get("/unverified-doctors", auth, adminOnly, getUnverifiedDoctors);
router.post("/verify-doctor", auth, adminOnly, verifyDoctor);
router.get("/doctors",auth,adminOnly,getAllDoctors);
router.delete("/delete-doctor",auth,adminOnly,deleteDoctor);

export default router;
