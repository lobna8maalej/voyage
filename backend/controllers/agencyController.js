import Agency from "../models/Agency.js";

export const createAgency = async (req, res) => {
  try {
    const { name, email, phone, city, country, description, image } =
      req.body;

    // 🔴 VALIDATION STRICTE
    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: "name and image are required",
      });
    }

    const existingAgency = await Agency.findOne({ email });
    if (existingAgency) {
      return res.status(400).json({
        success: false,
        message: "Agency already exists",
      });
    }

    const agency = await Agency.create({
      name,
      email,
      phone,
      city,
      country,
      description,
      image, // 🔥 MAIN IMAGE
      images: req.body.images || [],
    });

    return res.status(201).json({
      success: true,
      data: agency,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAgency = async (req, res) => {
  try {
    const updateData = {};

    const { name, email, phone, city, country, description, image } = req.body;

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (city) updateData.city = city;
    if (country) updateData.country = country;
    if (description) updateData.description = description;

    if (image) {
      updateData.image = image;
    }

    if (req.body.images && Array.isArray(req.body.images)) {
      updateData.images = req.body.images;
    }

    const agency = await Agency.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: "Agency not found",
      });
    }

    return res.json({
      success: true,
      data: agency,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find()
      .populate("service") // ✔ FIX
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: agencies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAgency = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    res.json({ agency });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};