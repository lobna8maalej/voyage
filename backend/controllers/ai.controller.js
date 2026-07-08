import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

export const aiChat = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const bookings = await Booking.find({ user: userId })
      .populate("service");

    const payments = await Payment.find({ user: userId })
      .populate("services");

    let response = "";
    const msg = message.toLowerCase();

    // ================= BOOKINGS =================
    if (msg.includes("book")) {
      response = bookings.map((b) => {
        return `
📌 Booking:
- Status: ${b.status}
- Payment: ${b.paymentStatus}
- Service: ${b.service?.name || "N/A"}
- Total: ${b.totalPrice || 0} TND
        `;
      }).join("\n");
    }

    // ================= PAYMENTS =================
    else if (msg.includes("payment")) {
      response = payments.map((p) => {
        const serviceNames =
          (p.services || []).map(s => s?.name).join(", ") || "N/A";

        return `
💳 Payment:
- Status: ${p.status}
- Amount: ${p.amount}
- Services: ${serviceNames}
        `;
      }).join("\n");
    }

    // ================= DEFAULT =================
    else {
      response =
        "I can help you with bookings, payments, and services.";
    }

    return res.json({ response });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};