import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cabinType: {
      type: String,
      enum: ["dj", "produccion"],
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    notes: {
      type: String,
    },
    price: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pendiente", "confirmada", "cancelada"],
      default: "pendiente",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", bookingSchema);
