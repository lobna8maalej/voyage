import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";


export const createRoom = async (req, res) => {
  try {
    const { title, location, price, description, capacity } = req.body;

    if (!title || !location || !price) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "rooms"
      });

      imageUrl = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const room = await Room.create({
      title,
      location,
      price,
      description,
      capacity,
      image: imageUrl
    });

    res.status(201).json(room);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAvailableRooms = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        message: "checkIn and checkOut are required"
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const bookings = await Booking.find({
      status: { $ne: "cancelled" },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate }
    });

    const bookedRoomIds = bookings.map(b => b.room.toString());

    const rooms = await Room.find({
      _id: { $nin: bookedRoomIds }
    });

    res.json(rooms);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoomImage = async (req, res) => {
  try {

    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "rooms"
    });

    fs.unlinkSync(req.file.path);

    const room = await Room.findByIdAndUpdate(
      id,
      { image: result.secure_url },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};