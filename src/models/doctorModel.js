import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // ===== existing fields =====
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  licenceNumber: { type: String, required: true },
  qualification: { type: String, required: true },
  fees: { type: Number, required: true },
  clinicAddress: { type: String, required: true },

  availability: [
    {
      day: String,
      timeSlots: [String]
    }
  ],

  clinicName: { type: String },        // hospital / clinic name
  bio: { type: String },               // about doctor

  address: { type: String },
  city: { type: String },
  state: { type: String },

  profilePhoto: { type: String },      // URL (cloudinary/firebase)

  documents: {
    licence: { type: String },          // URL
    degree: { type: String }            // URL
  }

}, { timestamps: true });

export default mongoose.model("DoctorProfile", doctorSchema);
