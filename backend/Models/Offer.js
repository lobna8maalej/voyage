import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },

  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
    required: true,
  },

  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
  },

  price: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },

  images: [
    {
      type: String,
    },
  ],
});

export default mongoose.model("Offer", offerSchema);