import mongoose from "mongoose";

const circuitSchema = new mongoose.Schema({

  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
    required: true,
  },


  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
    required: true,
  },


  title: {
    type: String,
    required: true,
  },


  startDate: Date,

  endDate: Date,


  days: Number,

  nights: Number,


  price: {
    type: Number,
    required: true,
  },


  programs: {
    type: [String],
    default: [],
  },


  images: {
    type: [String],
    default: [],
  },


  // 📞 Contact circuit / agence
  phone: {
    type: String,
    trim: true,
  },


  email: {
    type: String,
    trim: true,
  },


  website: {
    type: String,
    trim: true,
  },


}, {
  timestamps: true,
});


export default mongoose.model("Circuit", circuitSchema);