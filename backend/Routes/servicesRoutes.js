import express from "express";
import { upload } from "../middlewares/upload.js";

import {
  createService,
  getServices,
  getServicesByType,
  getServiceById,
  updateService,
  deleteService,
  getFeaturedServices,
  searchServices,
  addReview
} from "../controllers/servicecontroller.js";

import { authMiddleware } from "../middlewares/authmiddleware.js";

const router = express.Router();

/* ================= CREATE ================= */
router.post("/", authMiddleware, createService);

// upload images (MULTIPLE)
router.post("/", authMiddleware, upload.array("images", 10), createService);
/* ================= GET ALL ================= */
router.get("/", getServices);

router.get("/featured", getFeaturedServices);
router.get("/search", searchServices);
router.get("/type/:type", getServicesByType);
router.get("/:id", getServiceById);

router.put("/:id", authMiddleware, updateService);
router.delete("/:id", authMiddleware, deleteService);
router.post("/:id/reviews", authMiddleware, addReview);

export default router;