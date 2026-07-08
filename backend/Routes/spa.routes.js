import express from "express";
import multer from "multer";

import {
  createSpa,
  deleteSpa,
  getSpa,
  getSpas,
  updateSpa,
  uploadSpaImage,
} from "../controllers/spa.controller.js";

const router = express.Router();

/* ================= MULTER ================= */
const upload = multer({ dest: "uploads/" });

/* ================= IMAGE UPLOAD ================= */
router.post("/upload", upload.single("image"), uploadSpaImage);

/* ================= CRUD SPA ================= */
router.post("/", createSpa);
router.get("/:id", getSpa);
router.get("/", getSpas);
router.put("/:id", updateSpa);
router.delete("/:id", deleteSpa);

export default router;