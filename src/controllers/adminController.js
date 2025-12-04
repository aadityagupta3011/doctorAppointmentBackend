import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import DoctorProfile from "../models/doctorModel.js"

export const createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;  

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      gender: "other", // or optional if you later allow selection
      address: "not set",
      city: "not set",
      state: "not set",
      password: hashedPassword,
      role: "admin",
      isVerified: true
    });

    res.status(201).json({ message: "admin created successfully" });

  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

export const getUnverifiedDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", isVerified: false })
      .select("name email phone city state");

    res.json({ count: doctors.length, doctors });

  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};


// 🟢 Verify / Approve Doctor Account
export const verifyDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({ message: "doctorId is required" });
    }

    const doctor = await User.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "doctor not found" });
    }

    if (doctor.role !== "doctor") {
      return res.status(400).json({ message: "this user is not a doctor" });
    }

    if (doctor.isVerified) {
      return res.status(400).json({ message: "doctor already verified" });
    }

    doctor.isVerified = true;
    await doctor.save();

    res.json({ message: "doctor verified successfully" });

  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
  await doctorProfile.findOneAndDelete({userId:doctorId});
  
};


export const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({ message: "doctorId is required" });
    }

    // Find doctor user
    const doctor = await User.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "doctor not found" });
    }

    if (doctor.role !== "doctor") {
      return res.status(400).json({ message: "this user is not a doctor" });
    }

    // Remove doctor profile first
    await DoctorProfile.findOneAndDelete({ userId: doctorId });

    // Remove user account
    await User.findByIdAndDelete(doctorId);

    res.json({ message: "doctor deleted (rejected) successfully" });

  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
};
