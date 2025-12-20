import express from "express";
import { getAllDoctors, getDoctorDetails  } from "../controllers/doctorController.js";

import { auth } from "../middlewares/auth.js";
import { getDoctorAvailability , getDoctorStatus ,bookAppointment} from "../controllers/userController.js";


const router = express.Router();

router.get("/doctors", getAllDoctors);
router.get("/doctors/:id", getDoctorDetails);
router.get("/doctor/:doctorId/availability", getDoctorAvailability);
router.get("/doctor/:doctorId/status", getDoctorStatus);
router.post("/book-appointment", auth, bookAppointment);

export default router;
