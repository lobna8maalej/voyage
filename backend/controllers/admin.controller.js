import User from "../models/User.js";
import Booking from "../Models/Booking.js";
import Payment from "../models/Payment.js";
import Contact from "../models/Contact.js";
import Review from "../models/Review.js";
import Destination from "../models/Destination.js";
import Offer from "../models/Offer.js";
import Coupon from "../models/Coupon.js";

// ==================================================
// 📊 STATISTIQUES ADMIN
// ==================================================

export const getAdminStatistics = async (req, res) => {
  try {

    // ========================================
    // 📊 COMPTEURS
    // ========================================

    const users =
      await User.countDocuments();

    const bookings =
      await Booking.countDocuments();

    const payments =
      await Payment.countDocuments();

    const contacts =
      await Contact.countDocuments();

    const reviews =
      await Review.countDocuments();

    const destinations =
      await Destination.countDocuments();

    const offers =
      await Offer.countDocuments();

    const coupons =
      await Coupon.countDocuments();


    // ========================================
    // 💳 PAIEMENTS
    // ========================================

    const paidPayments =
      await Payment.countDocuments({
        status: "paid",
      });

    const pendingPayments =
      await Payment.countDocuments({
        status: "pending",
      });

    const failedPayments =
      await Payment.countDocuments({
        status: "failed",
      });

    const refundedPayments =
      await Payment.countDocuments({
        status: "refunded",
      });


    // ========================================
    // 💰 REVENUE
    // ========================================

    const revenue =
      await Payment.aggregate([
        {
          $match: {
            status: "paid",
          },
        },
        {
          $group: {
            _id: "$currency",

            total: {
              $sum: "$amount",
            },
          },
        },
      ]);


    // ========================================
    // 🎫 RÉSERVATIONS
    // ========================================

    const confirmedBookings =
      await Booking.countDocuments({
        status: "confirmed",
      });

    const pendingBookings =
      await Booking.countDocuments({
        status: "pending",
      });

    const cancelledBookings =
      await Booking.countDocuments({
        status: "cancelled",
      });


    // ========================================
    // 📊 RÉPONSE
    // ========================================

    res.status(200).json({

      success: true,

      data: {

        // Général
        users,
        bookings,
        payments,
        contacts,
        reviews,
        destinations,
        offers,
        coupons,

        // Paiements
        paidPayments,
        pendingPayments,
        failedPayments,
        refundedPayments,

        // Réservations
        confirmedBookings,
        pendingBookings,
        cancelledBookings,

        // Revenue
        revenue,

      },

    });

  } catch (error) {

    console.error(
      "❌ Erreur statistiques admin :",
      error
    );

    res.status(500).json({

      success: false,

      message: "Erreur serveur",

      error: error.message,

    });

  }
};


// ==================================================
// 💳 TOUS LES PAIEMENTS MONGODB
// ==================================================

// ==================================================
// 💳 TOUS LES PAIEMENTS ADMIN
// ==================================================

export const getAdminPayments = async (req, res) => {
  try {

    const payments = await Payment.find()
      .populate(
        "user",
        "name email"
      )
      .populate("booking")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({

      success: true,

      count: payments.length,

      data: payments,

    });

  } catch (error) {

    console.error(
      "❌ Erreur récupération paiements :",
      error
    );

    res.status(500).json({

      success: false,

      message: "Erreur serveur",

      error: error.message,

    });

  }
};