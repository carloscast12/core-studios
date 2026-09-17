import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    checkoutId: {
      type: String,
      required: true,
      unique: true,
    },
    checkoutReference: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pendiente", "pagado", "fallido"],
      default: "pendiente",
    },
    items: [
      {
        type: {
          type: String,
          enum: ["booking", "membership"],
          required: true,
        },
        booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        plan: { type: String },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
