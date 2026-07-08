import mongoose from "mongoose";

const spaSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },

  services: {
    type: [String],
    required: true,
  },

  images: {
    type: [String],
    default: [],
  },

  price: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Spa", spaSchema);