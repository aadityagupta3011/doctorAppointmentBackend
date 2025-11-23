import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  phone: { type: String, required: true },

  gender: { type: String, enum: ["male", "female", "other"], required: true },

  address: { type: String, required: true },

  city: { type: String, required: true },

  state: { type: String, required: true },

  password: { type: String, required: true },

  role: { 
    type: String, 
    enum: ["patient", "doctor", "admin"], 
    default: "patient" 
  },

  isVerified: { 
    type: Boolean, 
    default: false 
  },

  otp: String,
  otpExpires: Date

}, { timestamps: true });

export default mongoose.model("User", userSchema);
