import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // ==========================================
    // CLIENT
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // SERVICE
    // ==========================================

    service: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "serviceType",
    },

    serviceType: {
      type: String,
      required: true,
      enum: [
        "Hotel",
        "Agency",
        "Circuit",
      ],
    },

    // ==========================================
    // INFORMATIONS RÉSERVATION
    // ==========================================

    persons: {
      type: Number,
      default: 1,
      min: 1,
    },

    checkIn: {
      type: Date,
    },

    checkOut: {
      type: Date,
    },

    // ==========================================
    // DEMANDE PARTICULIÈRE
    // ==========================================

    message: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // PRIX
    // ==========================================

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==========================================
    // PAIEMENT
    // ==========================================

    paymentStatus: {
      type: String,
      enum: [
        "unpaid",
        "paid",
      ],
      default: "unpaid",
    },

    // ==========================================
    // STATUT RÉSERVATION
    // ==========================================

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "checked-in",
      ],
      default: "pending",
    },

    // ==========================================
    // ADMIN A VU LA RÉSERVATION
    // ==========================================

    adminViewed: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // STRIPE
    // ==========================================

    stripeSessionId: {
      type: String,
      default: null,
    },

    // ==========================================
    // QR CODE
    // ==========================================

    qrToken: {
      type: String,
      default: null,
      unique: true,
    },

    qrVerifiedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// =====================================================
// MODEL BOOKING
// Évite OverwriteModelError
// =====================================================

const Booking =
  mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);

export default Booking;