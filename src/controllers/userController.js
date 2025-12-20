import DoctorAvailability from "../models/DoctorAvailabilityModel.js";
import Appointment from "../models/AppointmentModel.js";
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

export const getDoctorStatus = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const availability = await DoctorAvailability.findOne({ doctorId });

    if (!availability) {
      return res.json({ isAvailable: false });
    }

    res.json({
      isAvailable: availability.isAvailable
    });

  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};


export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, fromTime, toTime } = req.body;
    const patientId = req.user.id;

    // basic validation
    if (!doctorId || !date || !fromTime || !toTime) {
      return res.status(400).json({
        message: "doctorId, date, fromTime and toTime are required"
      });
    }

    if (fromTime >= toTime) {
      return res.status(400).json({
        message: "fromTime must be before toTime"
      });
    }

    // check doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "doctor not found" });
    }

    // check doctor has availability (window only)
    const availability = await DoctorAvailability.findOne({ doctorId });
    if (!availability) {
      return res.status(400).json({
        message: "doctor has not set availability yet"
      });
    }

    // check requested time is inside availability window
    if (
      fromTime < availability.fromTime ||
      toTime > availability.toTime
    ) {
      return res.status(400).json({
        message: "requested time is outside doctor availability"
      });
    }

    // check overlapping APPROVED appointments
    const conflict = await Appointment.findOne({
      doctorId,
      date,
      status: "approved",
      $or: [
        { fromTime: { $lt: toTime }, toTime: { $gt: fromTime } }
      ]
    });

    if (conflict) {
      return res.status(400).json({
        message: "doctor already has an appointment in this time"
      });
    }

    // create appointment request
    const appointment = await Appointment.create({
      doctorId,
      patientId,
      date,
      fromTime,
      toTime
    });

    res.status(201).json({
      message: "appointment request sent",
      appointment
    });

  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
};
