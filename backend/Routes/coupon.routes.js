import express from "express";

import {
  createCoupon,
  getCoupons,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponById
} from "../controllers/coupon.controller.js";

import { authMiddleware } from "../middlewares/authmiddleware.js";

const router = express.Router();
router.post("/", authMiddleware, createCoupon);
router.get("/",  getCoupons);
router.get("/:id", getCouponById);

router.post("/validate", validateCoupon);
router.put("/:id", authMiddleware, updateCoupon);
router.delete("/:id", authMiddleware, deleteCoupon);
export default router;