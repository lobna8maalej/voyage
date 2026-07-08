import express from "express";

import {
  createHotel,
  getHotels,
  getHotel,
  updateHotel,
  deleteHotel,
  getHotelById 
} from "../controllers/hotelcontroller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/", authMiddleware, createHotel);
router.get("/", getHotels);
router.get("/:id", getHotel);
router.put("/:id", authMiddleware, updateHotel);
router.delete("/:id", authMiddleware, deleteHotel);
router.get("/:id", getHotelById);
export default router;