import express from "express";
import {
  createBooking,
  createCheckout,
  getBookings,
  getMyBookings,
  checkInBooking
} from "../controllers/booking.controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// CREATE BOOKING
router.post("/", authMiddleware, createBooking);

// STRIPE CHECKOUT
router.post("/checkout", authMiddleware, createCheckout);

// GET ALL BOOKINGS
router.get("/", authMiddleware, getBookings);

// MY BOOKINGS
router.get("/my", authMiddleware, getMyBookings);

// CHECK-IN QR
router.post("/checkin", authMiddleware, checkInBooking);

export default router;