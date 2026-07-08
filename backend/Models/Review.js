import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ce que l’utilisateur note
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },

    spa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spa",
    },

    circuit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Circuit",
    },

    // note globale
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },

    // optionnel (utile SaaS)
    title: {
      type: String,
      trim: true,
    },

    // sécurité / contrôle
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);