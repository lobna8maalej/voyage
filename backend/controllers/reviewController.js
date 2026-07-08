import Review from "../models/Review.js";

// ================= CREATE REVIEW =================
export const createReview = async (req, res) => {
  try {
    const {
      hotel,
      restaurant,
      spa,
      circuit,
      rating,
      comment,
      title,
    } = req.body;

    // au moins un target obligatoire
    if (!hotel && !restaurant && !spa && !circuit) {
      return res.status(400).json({
        message: "You must review a service",
      });
    }

    const review = await Review.create({
      user: req.user.id,
      hotel,
      restaurant,
      spa,
      circuit,
      rating,
      comment,
      title,
    });

    return res.status(201).json({
      success: true,
      review,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "username email")
      .populate("hotel")
      .populate("restaurant")
      .populate("spa")
      .populate("circuit");

    return res.json({
      success: true,
      reviews,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getReviewsByService = async (req, res) => {
  try {
    const { type, id } = req.params;

    const filter = {};
    filter[type] = id;

    const reviews = await Review.find(filter)
      .populate("user", "username email");

    return res.json({
      success: true,
      reviews,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // seul owner peut supprimer
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await review.deleteOne();

    return res.json({
      success: true,
      message: "Review deleted",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};