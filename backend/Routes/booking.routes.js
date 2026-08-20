import express from "express";

import {
  createBooking,
  createCheckout,
  getBookings,
  getMyBookings,
  checkInBooking,
  markBookingAsViewed,
} from "../controllers/booking.controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// =====================================================
// CLIENT : CRÉER UNE RÉSERVATION
// POST /api/bookings
// =====================================================

router.post(
  "/",
  authMiddleware,
  createBooking
);

// =====================================================
// CLIENT : PAIEMENT STRIPE
// POST /api/bookings/checkout
// =====================================================

router.post(
  "/checkout",
  authMiddleware,
  createCheckout
);

// =====================================================
// CLIENT : MES RÉSERVATIONS
// GET /api/bookings/my
// =====================================================

router.get(
  "/my",
  authMiddleware,
  getMyBookings
);

// =====================================================
// ADMIN : TOUTES LES RÉSERVATIONS
// GET /api/bookings
// =====================================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getBookings
);

// =====================================================
// ADMIN : MARQUER COMME VUE
// PUT /api/bookings/:id/viewed
// =====================================================

router.put(
  "/:id/viewed",
  authMiddleware,
  adminMiddleware,
  markBookingAsViewed
);

// =====================================================
// CHECK-IN
// POST /api/bookings/checkin
// =====================================================

router.post(
  "/checkin",
  authMiddleware,
  checkInBooking
);

export default router;