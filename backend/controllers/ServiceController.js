import Service from "../models/Service.js";
import {normalizeItem } from "../utils/normalizeItem.js";
export const createService = async (req, res) => {
  try {
    const images = req.files
      ? req.files.map(file =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        )
      : [];

    const service = await Service.create({
      ...req.body,
      images, // 👈 IMPORTANT: sauvegarde dans MongoDB
      createdBy: req.user?.id || null,
    });

    return res.status(201).json(service);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getServicesByType = async (req, res) => {
  try {
    const { type } = req.params;

    const services = await Service.find({
      type,
      available: true,
    });

    const result = services.map(s => ({
      ...s.toObject(),
      type: "service", // ✅ AJOUT
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// ================= GET ONE =================
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.json({
      ...service.toObject(),
      type: "service", // ✅ AJOUT
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// ================= UPDATE =================
export const updateService = async (req, res) => {
  try {

    const imagesFromUpload = req.files
      ? req.files.map(f => f.path)
      : [];

    const images = imagesFromUpload.length > 0
      ? [...new Set(imagesFromUpload)]
      : req.body.images;

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images
      },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= DELETE =================
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.json({ message: "Service deleted successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= FEATURED =================
export const getFeaturedServices = async (req, res) => {
  try {
    const services = await Service.find({
      featured: true,
      available: true,
    });

    const result = services.map(s => ({
      ...s.toObject(),
      type: "service", // ✅ AJOUT
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= SEARCH =================
export const searchServices = async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").toString().trim();
    if (!keyword) return res.json([]);

    const regex = new RegExp(keyword, "i");

    const services = await Service.find({
      $or: [
        { name: regex },
        { city: regex },
        { country: regex },
        { description: regex },
      ],
    });

    const result = services.map(s => ({
      ...s.toObject(),
      type: "service", // ✅ AJOUT
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= REVIEWS =================
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service)
      return res.status(404).json({ message: "Service not found" });

    if (!req.user?.id)
      return res.status(401).json({ message: "Unauthorized" });

    service.reviews.push({
      user: req.user.id,
      rating: Number(rating),
      comment,
    });

    service.reviewsCount = service.reviews.length;

    const total = service.reviews.reduce(
      (sum, r) => sum + r.rating,
      0
    );

    service.rating = total / service.reviews.length;

    await service.save();

    return res.json({
      message: "Review added successfully",
      service: {
        ...service.toObject(),
        type: "service", // ✅ FRONTEND FILTER FIX
      },
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();

    const result = services.map(s => normalizeItem(s)); 

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};