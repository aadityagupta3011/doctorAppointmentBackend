import express from "express";
import { auth } from "../middlewares/auth.js";
import { doctorOnly } from "../middlewares/doctorOnly.js";
import { setAvailability } from "../controllers/doctorController.js";
import { getMyProfile , updateDoctorName , updateMyProfile  } from "../controllers/doctorController.js";
import { toggleAvailability } from "../controllers/doctorController.js";

const router = express.Router();
router.get("/me", auth, doctorOnly, getMyProfile);
router.post("/availability", auth, doctorOnly, setAvailability);
router.put("/me", auth, doctorOnly, updateMyProfile);
router.put("/update-name", auth, doctorOnly, updateDoctorName);
router.put("/availability/toggle", auth, doctorOnly, toggleAvailability);
// router.post("/upload-photo", auth, doctorOnly, uploadProfilePhoto);
// router.post("/upload-documents", auth, doctorOnly, uploadDocuments);
export default router;