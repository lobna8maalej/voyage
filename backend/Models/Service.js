import mongoose from "mongoose";

// Review schema
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const serviceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "hotel",
        "room",
        "restaurant",
        "spa",
        "circuit",
        "offer",
        "coupon",
        "agency",
        "destination",
      ],
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: String,
    shortDescription: String,

    // ✅ FIX HERE (multiple images)
    images: {
      type: [String],
      default: [],
    },

    price: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "TND",
    },

    location: String,
    city: String,
    country: String,
    address: String,

    latitude: Number,
    longitude: Number,

    category: String,

    stars: {
      type: Number,
      min: 1,
      max: 5,
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],

    phone: String,
    email: String,
    website: String,
    openingHours: String,

    amenities: [String],

    available: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    discount: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Service", serviceSchema);