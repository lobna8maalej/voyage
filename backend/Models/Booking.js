import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    persons: {
      type: Number,
      default: 1,
    },

    checkIn: Date,
    checkOut: Date,

    totalPrice: Number,

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "checked-in"],
      default: "pending",
    },

    stripeSessionId: String,
    qrToken: String,
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);