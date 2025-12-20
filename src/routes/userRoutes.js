import express from "express";
import { getAllDoctors, getDoctorDetails } from "../controllers/doctorController.js";
import { getDoctorAvailability } from "../controllers/userController.js";

const router = express.Router();

router.get("/doctors", getAllDoctors);
router.get("/doctors/:id", getDoctorDetails);
router.get("/doctor/:doctorId/availability", getDoctorAvailability);
export default router;
