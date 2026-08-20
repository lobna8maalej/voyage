import express from "express";

import {
  createCheckoutSession,
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentStats,
  generateInvoice,
} from "../controllers/payment.controller.js";

const router = express.Router();

// ==================================================
// STRIPE CHECKOUT
// ==================================================

// POST /api/payments/create-checkout-session
router.post(
  "/create-checkout-session",
  createCheckoutSession
);

// ==================================================
// PAYMENT STATISTICS
// ==================================================

// GET /api/payments/stats
router.get(
  "/stats",
  getPaymentStats
);

// ==================================================
// PAYMENTS
// ==================================================

// POST /api/payments
router.post(
  "/",
  createPayment
);

// GET /api/payments
router.get(
  "/",
  getPayments
);

// ==================================================
// INVOICE
// ==================================================

// POST /api/payments/:id/invoice
router.post(
  "/:id/invoice",
  generateInvoice
);

// ==================================================
// PAYMENT BY ID
// ==================================================

// GET /api/payments/:id
router.get(
  "/:id",
  getPaymentById
);

// PUT /api/payments/:id
router.put(
  "/:id",
  updatePayment
);

// DELETE /api/payments/:id
router.delete(
  "/:id",
  deletePayment
);

export default router;