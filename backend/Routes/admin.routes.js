import express from "express";
import { getPayments } from "../controllers/payment.controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/payments", authMiddleware, isAdmin, getPayments);

export default router;