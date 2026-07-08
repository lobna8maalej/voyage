import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  address: {
    type: String,
  },

  city: {
    type: String,
  },

  country: {
    type: String,
  },

  images: {
    type: [String],
    default: [],
  },

  menu: [
    {
      name: String,
      price: Number,
    }
  ],

  openingHours: {
    type: String,
  },

  capacity: {
    type: Number,
    default: 1,
  },

  rating: {
    type: Number,
    default: 0,
  },

  isAvailable: {
    type: Boolean,
    default: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Restaurant", restaurantSchema);