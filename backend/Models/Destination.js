import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },

  description: {
    type: String,
  },

  price: {
    type: Number,
    default: 0, // important pour éviter undefined
  },
});

export default mongoose.model("Destination", destinationSchema);