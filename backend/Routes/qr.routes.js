import express from "express";
import { generateQR } from "../controllers/qr.controller.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { verifyQR } from "../controllers/qr.controller.js";
const router = express.Router();

// Generate QR Code for booking
router.post("/generate", authMiddleware, generateQR);
router.post("/verify", verifyQR);

export default router;