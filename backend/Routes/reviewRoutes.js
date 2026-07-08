import express from "express";

import {
  createReview,
  getReviews,
  getReviewsByService,
  deleteReview,
} from "../controllers/reviewcontroller.js";

import { authMiddleware } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createReview);

router.get("/", getReviews);

router.get("/:type/:id", getReviewsByService);

router.delete("/:id", authMiddleware, deleteReview);

export default router;