import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import DoctorProfile from "../models/doctorModel.js";
import DoctorAvailability from "../models/DoctorAvailabilityModel.js";

export const createDoctor = async (req, res) => {
  try {
    const { 
      name, email, phone, password, gender,
      address, city, state, 
      specialization, experience, licenceNumber, qualification, fees, clinicAddress 
    } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      gender,
      address,
      city,
      state,
      password: hashedPassword,
      role: "doctor",
      isVerified: true
    });

    // Try creating doctor profile
    try {
      await DoctorProfile.create({
        userId: user._id,
        specialization,
        experience,
        licenceNumber,
        qualification,
        fees,
        clinicAddress
      });
    } catch (error) {
      // If profile creation fails, delete created user
      await User.findByIdAndDelete(user._id);
      throw error;
    }

    res.status(201).json({ message: "doctor created successfully" });

  } catch (err) {
    res.status(400).json({
      message: "invalid doctor data",
      error: err.message
    });
  }
};


export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile
      .find()
      .populate("userId", "name email phone gender address city state");

    res.status(200).json({
      message: "doctors fetched successfully",
      count: doctors.length,
      doctors
    });

  } catch (err) {
    res.status(500).json({
      message: "server error",
      error: err.message
    });
  }
};

export const getDoctorDetails = async (req, res) => {
  try {
    const doctor = await DoctorProfile
      .findOne({ userId: req.params.id })
      .populate("userId", "name email phone gender address city state");

    if (!doctor) {
      return res.status(404).json({ message: "doctor not found" });
    }

    res.status(200).json({
      message: "doctor details fetched successfully",
      doctor
    });

  } catch (err) {
    res.status(500).json({
      message: "server error",
      error: err.message
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({ userId: req.user.id })
      .populate("userId", "name email phone");

    if (!doctorProfile) {
      return res.status(404).json({ message: "doctor profile not found" });
    }

    res.json(doctorProfile);

  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};
export const updateMyProfile = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        ...req.body,
        userId: req.user.id   // ensure userId exists on first create
      },
      {
        new: true,
        upsert: true          // 🔥 THIS IS THE KEY
      }
    );

    res.json({
      message: "profile updated successfully",
      doctorProfile
    });

  } catch (err) {
    res.status(400).json({ message: "invalid data", error: err.message });
  }
};


export const updateDoctorName = async (req, res) => {
  try {
    const { name } = req.body;

    await User.findByIdAndUpdate(req.user.id, { name });

    res.json({ message: "name updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

export const setAvailability = async (req, res) => {
  try {
    const { fromTime, toTime } = req.body;

    if (!fromTime || !toTime) {
      return res.status(400).json({ message: "fromTime and toTime are required" });
    }

    if (fromTime >= toTime) {
      return res.status(400).json({ message: "fromTime must be before toTime" });
    }

    const availability = await DoctorAvailability.findOneAndUpdate(
      { doctorId: req.user.id },
      { fromTime, toTime },
      { new: true, upsert: true }
    );

    res.json({
      message: "availability set successfully",
      availability
    });

  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
};


export const toggleAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    // validation
    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        message: "isAvailable must be true or false"
      });
    }

    // update availability
    const availability = await DoctorAvailability.findOneAndUpdate(
      { doctorId: req.user.id },
      { isAvailable },
      { new: true }
    );

    if (!availability) {
      return res.status(404).json({
        message: "availability not set yet"
      });
    }

    res.json({
      message: isAvailable
        ? "doctor is now available"
        : "doctor is now unavailable",
      availability
    });

  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
};
