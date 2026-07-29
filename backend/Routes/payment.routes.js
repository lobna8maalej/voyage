import express from "express";

import {
  createCheckoutSession,
  stripeWebhook,
  getPayments
} from "../controllers/payment.controller.js";

import { authMiddleware } from "../middlewares/authmiddleware.js";


const router = express.Router();



// TEST ROUTE
router.get("/test",(req,res)=>{

  res.json({
    message:"Payment route OK"
  });

});



// CREATE STRIPE CHECKOUT
// POST http://localhost:5000/api/payments/checkout
router.post(
  "/checkout",
  authMiddleware,
  createCheckoutSession
);



// STRIPE WEBHOOK
// POST http://localhost:5000/api/payments/webhook
router.post(
  "/webhook",
  express.raw({
    type:"application/json"
  }),
  stripeWebhook
);



// GET PAYMENTS
// GET http://localhost:5000/api/payments
router.get(
  "/",
  authMiddleware,
  getPayments
);



export default router;