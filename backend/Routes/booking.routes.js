import express from "express";
import {
  createBooking,
  createCheckout,
  getBookings,
  getMyBookings,
  checkInBooking
} from "../controllers/booking.controller.js";

const router = express.Router();

// CREATE BOOKING
router.post("/", createBooking);

// CHECKOUT STRIPE
router.post("/checkout", createCheckout);

// GET ALL
router.get("/", getBookings);

// MY BOOKINGS
router.get("/my", getMyBookings);

// CHECK-IN QR
router.post("/checkin", checkInBooking);

export default router;