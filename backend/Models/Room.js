import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  description: String,
  capacity: Number,
  image: String,
  available: {
    type: Boolean,
    default: true
  }
});

const Room = mongoose.model("Room", roomSchema);

export default Room;