import express from "express";

import {
  generateQR,
  verifyQR,
} from "../controllers/qr.controller.js";

import {
  authMiddleware,
} from "../middlewares/authMiddleware.js";


const router = express.Router();


/* =====================================================
   GENERATE QR CODE
   POST /api/qr/generate
===================================================== */

router.post(
  "/generate",
  authMiddleware,
  generateQR
);


/* =====================================================
   VERIFY QR CODE
   POST /api/qr/verify
===================================================== */

router.post(
  "/verify",
  authMiddleware,
  verifyQR
);


export default router;