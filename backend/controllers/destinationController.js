import Destination from "../models/Destination.js";

// ================= CREATE DESTINATION =================
export const createDestination = async (req, res) => {
  try {
    const { country, city, image, description } = req.body;

    const destination = await Destination.create({
      country,
      city,
      image,
      description,
    });

    return res.status(201).json({
      success: true,
      destination,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();

    return res.json({
      success: true,
      destinations,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    return res.json({
      success: true,
      destination,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    // 🔥 build update object
    const updateData = {
      ...req.body, // price, city, country etc
    };

    // 🖼 image update (si nouvelle image envoyée)
    if (req.file) {
      updateData.image = req.file.path; // Cloudinary
    }

    const updated = await Destination.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    return res.json({
      success: true,
      destination: updated,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    await destination.deleteOne();

    return res.json({
      success: true,
      message: "Destination deleted",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};