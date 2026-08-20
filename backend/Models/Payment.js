import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // ==================================================
    // 🎫 BOOKING
    // ==================================================

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    // ==================================================
    // 👤 USER
    // ==================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==================================================
    // 🏨 SERVICE
    // ==================================================

    service: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // ==================================================
    // TYPE SERVICE
    // ==================================================

    serviceType: {
      type: String,
      enum: [
        "Hotel",
        "Agency",
        "Circuit",
      ],
      required: true,
    },

    // ==================================================
    // 💰 MONTANT
    // ==================================================

    amount: {
      type: Number,
      required: true,
    },

    // ==================================================
    // 💱 DEVISE
    // ==================================================

    currency: {
      type: String,
      default: "EUR",
    },

    // ==================================================
    // 💳 MÉTHODE PAIEMENT
    // ==================================================

    paymentMethod: {
      type: String,
      enum: [
        "card",
        "cheque",
        "bank_transfer",
        "cash",
      ],
      default: "card",
    },

    // ==================================================
    // 📌 STATUT
    // ==================================================

    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
    },

    // ==================================================
    // STRIPE
    // ==================================================

    stripeSessionId: {
      type: String,
      default: null,
    },

    stripePaymentIntentId: {
      type: String,
      default: null,
    },

    stripeCustomerId: {
      type: String,
      default: null,
    },

    receiptUrl: {
      type: String,
      default: null,
    },

    // ==================================================
    // 👤 CLIENT
    // ==================================================

    customerEmail: {
      type: String,
      default: null,
    },

    // ==================================================
    // 🧾 CHÈQUE
    // ==================================================

    chequeNumber: {
      type: String,
      default: null,
    },

    chequeBank: {
      type: String,
      default: null,
    },

    chequeDate: {
      type: Date,
      default: null,
    },

    // ==================================================
    // 🏦 VIREMENT
    // ==================================================

    transactionReference: {
      type: String,
      default: null,
    },

    // ==================================================
    // 🧾 FACTURE
    // ==================================================

    invoiceUrl: {
      type: String,
      default: null,
    },

    invoiceStatus: {
      type: String,
      enum: [
        "not_generated",
        "generated",
      ],
      default: "not_generated",
    },

    // ==================================================
    // 📅 DATE PAIEMENT
    // ==================================================

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Payment",
  paymentSchema
);