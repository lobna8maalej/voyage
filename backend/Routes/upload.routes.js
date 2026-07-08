import express from "express";
import multer from "multer";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(), // 🔥 IMPORTANT
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = await uploadToCloudinary(req.file);

    res.json({
      success: true,
      image: imageUrl,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;