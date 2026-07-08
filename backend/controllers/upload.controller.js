import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import Offer from "../models/Offer.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const url = await uploadToCloudinary(file.buffer, req.body.folder || "uploads");
      uploadedImages.push(url);
    }

    return res.json({
      images: uploadedImages,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateOfferImages = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const images = [];

    for (const file of req.files) {
      const url = await uploadToCloudinary(file.buffer, "offers");
      images.push(url);
    }

    const offer = await Offer.findByIdAndUpdate(
      id,
      { images },
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    return res.json({
      success: true,
      offer,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};