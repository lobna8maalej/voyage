import mongoose from "mongoose";

/* =====================================================
   COUPON SCHEMA
===================================================== */

const couponSchema = new mongoose.Schema(
  {
    /* ============================
       CODE PROMO
    ============================ */

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    /* ============================
       RÉDUCTION
    ============================ */

    discount: {
      type: Number,
      required: true,
    },

    /* ============================
       DATE D'EXPIRATION
    ============================ */

    expireDate: {
      type: Date,
      required: true,
    },

    /* ============================
       COUPON ACTIF
    ============================ */

    active: {
      type: Boolean,
      default: true,
    },

    /* ============================
       NOMBRE D'UTILISATIONS
    ============================ */

    usageCount: {
      type: Number,
      default: 0,
    },
  },

  /* ============================
     DATES AUTOMATIQUES
  ============================ */

  {
    timestamps: true,
  }
);

/* =====================================================
   MODEL
===================================================== */

const Coupon = mongoose.model(
  "Coupon",
  couponSchema
);

export default Coupon;