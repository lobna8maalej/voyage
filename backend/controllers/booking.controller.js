import Stripe from "stripe";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import { sendBookingEmail } from "../services/mail.service.js";
import { sendWhatsAppMessage } from "../services/twilio.service.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//
// =======================
// CREATE BOOKING (OPTIONNEL)
// =======================
//
export const createBooking = async (req, res) => {
  try {
    const { serviceId, persons } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = await Booking.create({
      user: req.user.id,
      service: serviceId,
      persons: persons || 1,
      status: "pending",
      paymentStatus: "unpaid",
      qrToken: crypto.randomUUID(),
    });

    return res.status(201).json({ booking });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//
// =======================
// GET ALL BOOKINGS
// =======================
//
export const getBookings = async (req, res) => {
  try {
   const bookings = await Booking.find()
  .populate({
    path: "service",
    model: "Service",
  })
  .populate("user", "name email");
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//
// =======================
// MY BOOKINGS
// =======================
//
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
  .populate({
    path: "service",
    model: "Service",
    select: "name images price city country type description",
  })
  .populate("user", "name email");

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//
// =======================
// CHECK-IN BOOKING (QR)
// =======================
//
export const checkInBooking = async (req, res) => {
  try {
    const { qrToken } = req.body;

    const booking = await Booking.findOne({ qrToken }).populate("service");

    if (!booking) {
      return res.status(404).json({ message: "Invalid QR" });
    }

    if (booking.paymentStatus !== "paid") {
      return res.status(403).json({ message: "Payment required" });
    }

    if (booking.status === "checked-in") {
      return res.json({ message: "Already checked-in" });
    }

    booking.status = "checked-in";
    await booking.save();

    return res.json({ success: true, booking });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//
// =======================
// STRIPE CHECKOUT
// =======================
//
export const createCheckout = async (req, res) => {
  try {
    const { serviceId, persons } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const totalPrice = service.price * (persons || 1);

    const booking = await Booking.create({
      user: req.user.id,
      service: serviceId,
      persons: persons || 1,
      status: "pending",
      paymentStatus: "unpaid",
      qrToken: crypto.randomUUID(),
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,

      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: service.name,
              description: service.description,
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        bookingId: booking._id.toString(),
      },

      success_url: `${process.env.FRONTEND_URL}/payment-success?bookingId=${booking._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    return res.json({ url: session.url });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//
// =======================
// STRIPE WEBHOOK
// =======================
//
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        return res.status(400).json({ message: "Missing bookingId" });
      }

      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          paymentStatus: "paid",
          status: "confirmed",
          stripeSessionId: session.id,
        },
        { new: true }
      ).populate("service");

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      try {
        await sendBookingEmail(booking);
      } catch (e) {
        console.log("Email error:", e.message);
      }

      try {
        if (booking.service?.phone) {
          await sendWhatsAppMessage(
            booking.service.phone,
            `Booking confirmed: ${booking.service.name}`
          );
        }
      } catch (e) {
        console.log("WhatsApp error:", e.message);
      }

      console.log("✅ Booking confirmed:", booking._id);
    }

    return res.json({ received: true });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};