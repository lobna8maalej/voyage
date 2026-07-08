import express from "express";

import {
  createCircuit,
  getCircuits,
  getCircuit,
  updateCircuit,
  deleteCircuit,
} from "../controllers/circuitController.js";

import { authMiddleware} from "../middlewares/authmiddleware.js";

const router = express.Router();
router.post("/", authMiddleware, createCircuit);
router.get("/", getCircuits);
router.get("/:id", getCircuit);
router.put("/:id", authMiddleware, updateCircuit);
router.delete("/:id", authMiddleware, deleteCircuit);
export default router;