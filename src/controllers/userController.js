import DoctorAvailability from "../models/DoctorAvailabilityModel.js";
import User from "../models/userModel.js";

export const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // check doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "doctor not found" });
    }

    const availability = await DoctorAvailability.findOne({ doctorId });

    if (!availability) {
      return res.status(200).json({
        message: "doctor has not set availability yet",
        availability: null
      });
    }

    res.json({
      doctorId,
      fromTime: availability.fromTime,
      toTime: availability.toTime
    });

  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
};
