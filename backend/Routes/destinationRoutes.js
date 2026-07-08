import express from "express";

import {
  createDestination,
  getDestinations,
  getDestination,
  updateDestination,
  deleteDestination,
} from "../controllers/destinationcontroller.js";

import { authMiddleware } from "../middlewares/authmiddleware.js";
import { upload } from "../middlewares/upload.js";
const router = express.Router();

router.post("/", authMiddleware, createDestination);
router.get("/", getDestinations);
router.get("/:id", getDestination);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  updateDestination
);
router.delete("/:id", authMiddleware, deleteDestination);
export default router;