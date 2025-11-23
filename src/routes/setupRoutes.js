import express from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/create-first-admin", async (req, res) => {
  try {
    const exist = await User.findOne({ role: "admin" });
    if (exist) return res.status(400).json({ message: "admin already exists" });

    const hashed = await bcrypt.hash("aadityaAdmin@123", 10);

    await User.create({
      name: "Jasmin Kaur",
      email: "jasmine2772004@gmail.com",
      phone: "7737065276",
      gender: "female",
      address: "Sodalad",
      city: "Jaipur",
      state: "Rajasthan",
      password: hashed,
      role: "admin",
      isVerified: true
    });

    res.json({ message: "admin created. login using admin@example.com / admin123" });

  } catch (err) {
    res.status(500).json({ message: "error", error: err.message });
  }
});

export default router;
