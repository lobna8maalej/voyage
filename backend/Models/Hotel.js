import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({

  name: { 
    type: String, 
    required: true 
  },


  description: { 
    type: String 
  },


  address: String,

  country: String,

  city: String,


  images: [String],


  stars: { 
    type: Number, 
    default: 3 
  },


  amenities: [String],


  // 💰 Prix
  price: {
    type: Number,
    required: true,
    default: 100
  },


  // 📞 Contact hôtel
  email: {
    type: String,
    trim: true
  },


  // 📱 Téléphone utilisé aussi pour WhatsApp
  phone: {
    type: String,
    trim: true
  },


  // 🌐 Site web officiel
  website: {
    type: String,
    trim: true
  }


}, {
  timestamps: true
});


export default mongoose.model("Hotel", hotelSchema);