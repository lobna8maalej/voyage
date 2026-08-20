import express from "express";
import cors from "cors";
import path from "path";

import { stripeWebhook } from "./controllers/payment.controller.js";

// ========================================
// ROUTES
// ========================================

import roomRoutes from "./routes/room.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import twilioRoutes from "./routes/twilio.routes.js";
import hotelRoutes from "./routes/hotelroutes.js";
import offerRoutes from "./routes/offerroutes.js";
import circuitRoutes from "./routes/circuitroutes.js";
import destinationRoutes from "./routes/destinationroutes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import spaRoutes from "./routes/spa.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import reviewRoutes from "./routes/reviewroutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import uploadRoutes from "./routes/upload.routes.js";
import qrRoutes from "./routes/qr.routes.js";
import agencyRoutes from "./routes/agencyRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// ⭐ IMPORTANT
// Reservation doit aussi utiliser ES Module

// ========================================
// APP
// ========================================

const app = express();

// ========================================
// CORS
// ========================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.100.24:5173",
    ],
    credentials: true,
  })
);

// ========================================
// STRIPE WEBHOOK
// IMPORTANT : AVANT express.json()
// ========================================

app.post(
  "/api/payment/webhook",
  express.raw({
    type: "application/json",
  }),
  stripeWebhook
);

// ========================================
// BODY PARSER
// ========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ========================================
// STATIC UPLOADS
// ========================================

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

// ========================================
// ROUTES API
// ========================================

// ========================================
// 🛏️ ROOMS
// ========================================

app.use(
  "/api/rooms",
  roomRoutes
);

// ========================================
// 🎫 BOOKINGS
// ========================================

app.use(
  "/api/bookings",
  bookingRoutes
);

// ========================================
// 💳 PAYMENTS
// ========================================

app.use(
  "/api/payments",
  paymentRoutes
);

// ========================================
// 🔐 AUTHENTICATION
// ========================================

app.use(
  "/api/auth",
  userRoutes
);

// ========================================
// 👑 ADMIN
// ========================================

app.use(
  "/api/admin",
  adminRoutes
);

// ========================================
// 📱 TWILIO
// ========================================

app.use(
  "/api/twilio",
  twilioRoutes
);

// ========================================
// 🤖 AI / CHAT
// ========================================

app.use(
  "/api/chat",
  aiRoutes
);

// ========================================
// 🏨 HOTELS
// ========================================

app.use(
  "/api/hotels",
  hotelRoutes
);

// ========================================
// 🎁 OFFERS
// ========================================

app.use(
  "/api/offers",
  offerRoutes
);

// ========================================
// 🌍 CIRCUITS
// ========================================

app.use(
  "/api/circuits",
  circuitRoutes
);

// ========================================
// 📍 DESTINATIONS
// ========================================

app.use(
  "/api/destinations",
  destinationRoutes
);

// ========================================
// 🍽️ RESTAURANTS
// ========================================

app.use(
  "/api/restaurants",
  restaurantRoutes
);

// ========================================
// 💆 SPA
// ========================================

app.use(
  "/api/spa",
  spaRoutes
);

// ========================================
// 🎟️ COUPONS
// ========================================

app.use(
  "/api/coupons",
  couponRoutes
);

// ========================================
// ⭐ REVIEWS
// ========================================

app.use(
  "/api/reviews",
  reviewRoutes
);

// ========================================
// 🛎️ SERVICES
// ========================================

app.use(
  "/api/services",
  servicesRoutes
);

// ========================================
// 📩 CONTACTS
// ========================================

app.use(
  "/api/contacts",
  contactRoutes
);

// ========================================
// 📤 UPLOADS API
// ========================================

app.use(
  "/api/uploads",
  uploadRoutes
);

// ========================================
// 🔳 QR CODES
// ========================================

app.use(
  "/api/qr",
  qrRoutes
);

// ========================================
// 🏢 AGENCIES
// ========================================

app.use(
  "/api/agency",
  agencyRoutes
);




// ========================================
// TEST API
// ========================================

app.get(
  "/api",
  (req, res) => {
    res.json({
      success: true,
      message:
        "🌍 Travel Platform API fonctionne correctement",
    });
  }
);

// ========================================
// 404
// ========================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        `Route introuvable : ${req.method} ${req.originalUrl}`,
    });
  }
);

// ========================================
// EXPORT
// ========================================

export default app;