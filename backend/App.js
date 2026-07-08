import express from "express";
import cors from "cors";
import path from "path";

import { stripeWebhook } from "./controllers/payment.controller.js";

// routes
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
import aiRoutes from "./routes/aiRoutes.js"
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.100.24:5173",
    ],
    credentials: true,
  })
);

// webhook
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static uploads (FIXED)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/twilio", twilioRoutes);
app.use("/api/chat", aiRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/circuits", circuitRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/spa", spaRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/services", servicesRoutes);

app.use("/api/uploads", uploadRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/agency", agencyRoutes);

export default app;