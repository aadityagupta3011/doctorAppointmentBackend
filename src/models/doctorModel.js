import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true }, // in years
  qualification: { type: String, required: true },
  fees: { type: Number, required: true },
  clinicAddress: { type: String, required: true },
  availability: [
    {
      day: String,
      timeSlots: [String] // later we will structure better
    }
  ]
}, { timestamps: true });

export default mongoose.model("DoctorProfile", doctorSchema);
