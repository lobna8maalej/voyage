import express from "express";

import {
  getAdminStatistics,
  getAdminPayments,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get(
  "/statistics",
  getAdminStatistics
);

router.get(
  "/payments",
  getAdminPayments
);

export default router;