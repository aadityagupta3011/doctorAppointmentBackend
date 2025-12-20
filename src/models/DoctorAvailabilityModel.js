import mongoose from "mongoose";

const doctorAvailabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // one availability per doctor
    },

    fromTime: {
      type: String, // "09:00"
      required: true
    },

    toTime: {
      type: String, // "17:00"
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("DoctorAvailability", doctorAvailabilitySchema);
