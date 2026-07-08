import Stripe from "stripe";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";
import Payment from "../models/Payment.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid bookingId" });
    }

    // 1. GET BOOKING
    const booking = await Booking.findById(bookingId)
      .populate("service");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 2. PRICE
    let price = Number(booking.totalPrice);

    if (!price || price <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    const productName =
      booking.services?.map(s => s.name).join(", ") ||
      "Travel Booking";

    // 3. CREATE STRIPE SESSION (IMPORTANT 🔥)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        bookingId: booking._id.toString(),
      },

      success_url: "http://localhost:5173/success?bookingId=" + booking._id,
      cancel_url: "http://localhost:5173/cancel",
    });

    // 4. RETURN URL
    return res.json({ url: session.url });

  } catch (error) {
    console.log("Stripe Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const stripeWebhook = async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const bookingId = session.metadata.bookingId;

      await Booking.findByIdAndUpdate(
        bookingId,
        {
          paymentStatus: "paid",
          status: "confirmed",
        },
        { new: true }
      );

      console.log("Payment success:", bookingId);
    }

    return res.json({ received: true });

  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await stripe.paymentIntents.list({
      limit: 100,
    });

    const result = payments.data.map((payment) => ({
      id: payment.id,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: payment.status,
      created: new Date(payment.created * 1000),
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};