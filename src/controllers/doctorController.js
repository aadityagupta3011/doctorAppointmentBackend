import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import DoctorProfile from "../models/doctorModel.js";

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
  