import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
    coveredByMembership: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

bookingSchema.index({ cabinType: 1, startTime: 1 });

export default mongoose.model("Booking", bookingSchema);
