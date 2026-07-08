import QRCode from "qrcode";
import Booking from "../models/Booking.js";
import crypto from "crypto";

export const generateQR = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // si pas de token → générer
    if (!booking.qrToken) {
      booking.qrToken = crypto.randomBytes(16).toString("hex");
      await booking.save();
    }

    // QR contient seulement un token sécurisé
    const qrData = JSON.stringify({
      token: booking.qrToken,
      bookingId: booking._id,
    });

    const qrCode = await QRCode.toDataURL(qrData);

    return res.json({
      success: true,
      qrCode,
      token: booking.qrToken,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



export const verifyQR = async (req, res) => {
  const { bookingId, token } = req.body;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.qrToken !== token) {
    return res.status(400).json({ message: "Invalid QR" });
  }

  booking.status = "checked-in";
  await booking.save();

  res.json({ message: "Check-in success" });
};