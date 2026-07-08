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

import { authMiddleware } from "../middlewares/authmiddleware.js";
import { upload } from "../middlewares/upload.js"; 

const router = express.Router();

// ================= ROUTES =================

router.post("/", authMiddleware, createOffer);

router.get("/", authMiddleware, getOffers);

router.get("/booking/:bookingId", authMiddleware, getOffersByBooking);

router.patch("/:id/accept", authMiddleware, acceptOffer);
router.get("/:id", authMiddleware, getOfferById);
router.patch("/:id/reject", authMiddleware, rejectOffer);
router.put("/:id", updateOffer);
router.put(
  "/:id/images",
  authMiddleware,
  upload.array("images"),
  updateOfferImages
);

export default router; 