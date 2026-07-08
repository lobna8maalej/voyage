import Spa from "../models/Spa.js";
import axios from "axios";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

export const uploadSpaImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "spa",
    });

    res.json({
      image: result.secure_url, // 🔥 IMPORTANT
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
async function fetchImageBuffer(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary");
}
export async function migrateSpaImages() {
  try {
    const spas = await Spa.find(); // récupère tous les spas
    for (const spa of spas) {
      const newImages = [];

      for (const img of spa.images) {
        // si déjà Cloudinary, on garde
        if (img.includes("res.cloudinary.com")) {
          newImages.push(img);
        } else {
          // sinon on télécharge et réuploade
          const buffer = await fetchImageBuffer(img);
          const cloudUrl = await uploadToCloudinary(buffer, "spa");
          newImages.push(cloudUrl);
        }
      }

      spa.images = newImages;
      await spa.save();
      console.log(`Spa ${spa._id} mis à jour avec Cloudinary`);
    }
  } catch (err) {
    console.error("Erreur migration images:", err.message);
  }
}


export const createSpa = async (req, res) => {
  try {
    const { hotel, services, images, price } = req.body;

    // tableau final des URLs Cloudinary
    const uploadedImages = [];

    if (images && Array.isArray(images)) {
      for (const img of images) {
        // si c’est déjà une URL Cloudinary, on la garde
        if (img.includes("res.cloudinary.com")) {
          uploadedImages.push(img);
        } else {
          // sinon on télécharge et on réuploade
          const buffer = await fetchImageBuffer(img);
          const imageUrl = await uploadToCloudinary(buffer, "spa");
          uploadedImages.push(imageUrl);
        }
      }
    }

    const spa = await Spa.create({
      hotel,
      services,
      images: uploadedImages,
      price,
    });

    return res.status(201).json({
      success: true,
      spa,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getSpas = async (req, res) => {
  try {
    const spas = await Spa.find()
      .populate("hotel");

    return res.json({
      success: true,
      spas,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getSpa = async (req, res) => {
  try {
    const spa = await Spa.findById(req.params.id)
      .populate("hotel");

    if (!spa) {
      return res.status(404).json({
        message: "Spa not found",
      });
    }

    return res.json({
      success: true,
      spa,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateSpa = async (req, res) => {
  try {
    const spa = await Spa.findById(req.params.id);

    if (!spa) {
      return res.status(404).json({
        message: "Spa not found",
      });
    }

    const updated = await Spa.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("hotel");

    return res.json({
      success: true,
      spa: updated,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteSpa = async (req, res) => {
  try {
    const spa = await Spa.findById(req.params.id);

    if (!spa) {
      return res.status(404).json({
        message: "Spa not found",
      });
    }

    await spa.deleteOne();

    return res.json({
      success: true,
      message: "Spa deleted",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};