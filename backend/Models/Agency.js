import mongoose from "mongoose";

const agencySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },

    email: String,

    phone: String,

    city: String,

    country: String,

    description: String,


    // 🔥 PRIX DE L'AGENCE (pour Booking + Stripe)
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },


    // IMAGE PRINCIPALE
    image: {
      type: String,
      required: true,
    },


    // images secondaires optionnelles
    images: {
      type: [String],
      default: [],
    },


    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },


    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],


    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model(
  "Agency",
  agencySchema
);