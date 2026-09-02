import mongoose from "mongoose";

export const MEMBERSHIP_PLANS = {
  basic: { label: "Básico", price: 100, hours: 10, videoset: false },
  premium: { label: "Premium", price: 150, hours: 13, videoset: true },
};

const membershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: Object.keys(MEMBERSHIP_PLANS),
      required: true,
    },
    status: {
      type: String,
      enum: ["activa", "pausada", "cancelada"],
      default: "activa",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    currentCycleStart: {
      type: Date,
      default: Date.now,
    },
    hoursRemaining: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Membership", membershipSchema);
