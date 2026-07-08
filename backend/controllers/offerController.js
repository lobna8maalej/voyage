import Offer from "../models/Offer.js";
import Booking from "../models/Booking.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const createOffer = async (req, res) => {
  try {
    const { bookingId, hotel, price, description } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking request not found",
      });
    }

    const offer = await Offer.create({
      booking: bookingId,
      agency: req.user.id,
      hotel,
      price,
      description,
      status: "pending",
      images: [],
    });

    return res.status(201).json({
      success: true,
      offer,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ALL OFFERS =================
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate("agency")
      .populate("hotel")
      .populate("booking")
      .sort({ createdAt: -1 });

    const formatted = offers.map((o) => ({
      ...o.toObject(),
      images:
        o.images?.length > 0
          ? o.images
          : o.hotel?.images?.length > 0
          ? o.hotel.images
          : [],
    }));

    return res.status(200).json({
      success: true,
      offers: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOffersByBooking = async (req, res) => {
  try {
    const offers = await Offer.find({
      booking: req.params.bookingId,
    })
      .populate("agency")
      .populate("hotel");

    return res.json({
      success: true,
      offers,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const acceptOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    if (offer.status !== "pending") {
      return res.status(400).json({
        message: "Offer already processed",
      });
    }

    offer.status = "accepted";
    await offer.save();

    res.json({
      success: true,
      offer,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    if (offer.status !== "pending") {
      return res.status(400).json({
        message: "Offer already processed",
      });
    }

    offer.status = "rejected";
    await offer.save();

    return res.json({
      success: true,
      message: "Offer rejected",
      offer,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateOfferImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body; // 👈 URLs Cloudinary

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ message: "Images must be an array" });
    }

    // 🔥 replace images
    offer.images = images;

    await offer.save();

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
export const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json({
      success: true,
      offer
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findById(id)
      .populate("agency")
      .populate("hotel")
      .populate("booking");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // format images comme dans getOffers
    const formatted = {
      ...offer.toObject(),
      images:
        offer.images?.length > 0
          ? offer.images
          : offer.hotel?.images?.length > 0
          ? offer.hotel.images
          : [],
    };

    return res.status(200).json({
      success: true,
      offer: formatted,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};