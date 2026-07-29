import express from "express";

import {
  createOffer,
  getOffers,
  getOffersByBooking,
  acceptOffer,
  rejectOffer,
  updateOfferImages,
  updateOffer,
  getOfferById
} from "../controllers/offercontroller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// ================= CREATE =================
router.post("/", authMiddleware, createOffer);

// ================= GET =================

// Public
router.get("/", getOffers);

// Public
router.get("/:id", getOfferById);

// Protected
router.get("/booking/:bookingId", authMiddleware, getOffersByBooking);

// ================= UPDATE =================
router.put("/:id", authMiddleware, updateOffer);

router.put(
  "/:id/images",
  authMiddleware,
  upload.array("images"),
  updateOfferImages
);

// ================= ACTIONS =================
router.patch("/:id/accept", authMiddleware, acceptOffer);

router.patch("/:id/reject", authMiddleware, rejectOffer);

export default router;