import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true
    },

    fromTime: {
      type: String,
      required: true
    },

    toTime: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
