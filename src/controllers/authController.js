import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpMail } from "../utils/sendOtp.js";

export const register = async (req, res) => {
  try {
    const { name, email, phone, gender, address, city, state, password } = req.body;

    // stop anyone from trying to send role manually
    if (req.body.role) {
      return res.status(400).json({
        message: "role cannot be selected during registration"
      });
    }

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // otp generate
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await sendOtpMail(email, otp);

    await User.create({
      name,
      email,
      phone,
      gender,
      address,
      city,
      state,
      password: hashedPassword,
      role: "patient", // 🔥 always patient
      otp,
      otpExpires
    });

    res.status(201).json({ message: "otp sent to your email" });

  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "user not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "invalid otp" });

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: "otp expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({ message: "otp verified successfully" });

  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "invalid email" });

    if (!user.isVerified)
      return res.status(400).json({ message: "please verify your email first" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "login successful", token, user });

  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const { name, email, phone, gender, address, city, state, password, specialization, experience, fees } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      gender,
      address,
      city,
      state,
      password: hashedPassword,
      role: "doctor",
      isVerified: true // admin verified
    });

    res.status(201).json({ message: "doctor account created successfully" });

  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};


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
      password: hashedPassword,
      role: "admin",
      isVerified: true
    });

    res.status(201).json({ message: "admin created successfully" });

  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};
