import bcrypt from "bcrypt";
import User from "../models/userModel.js";

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
