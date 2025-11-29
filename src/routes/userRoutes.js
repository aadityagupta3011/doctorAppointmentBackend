import express from "express";
import { getAllDoctors, getDoctorDetails } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/doctors", getAllDoctors);
router.get("/doctors/:id", getDoctorDetails);

export default router;
