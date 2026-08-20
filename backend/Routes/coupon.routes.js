import express from "express";

import {
  createCoupon,
  getCoupons,
  getCouponById,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  useCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

// CREATE
router.post("/", createCoupon);

// GET ALL
router.get("/", getCoupons);

// VALIDATE
router.post("/validate", validateCoupon);

// USE / COPY
router.post("/:id/use", useCoupon);

// GET BY ID
router.get("/:id", getCouponById);

// UPDATE
router.put("/:id", updateCoupon);

// DELETE
router.delete("/:id", deleteCoupon);

export default router;