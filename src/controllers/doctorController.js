import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import DoctorProfile from "../models/doctorModel.js";

export const createDoctor = async (req, res) => {
  try {
    const { 
      name, email, phone, password, gender,
      address, city, state, 
      specialization, experience, qualification, fees, clinicAddress 
    } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account
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

    // Create separate doctor profile
    await DoctorProfile.create({
      userId: user._id,
      specialization,
      experience,
      qualification,
      fees,
      clinicAddress
    });

    res.status(201).json({ message: "doctor created successfully" });

  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};
