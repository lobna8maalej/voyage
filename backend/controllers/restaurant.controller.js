import Restaurant from "../models/Restaurant.js";

// ================= CREATE RESTAURANT =================
export const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      city,
      country,
      images,
      menu,
      openingHours,
      capacity,
    } = req.body;

    const restaurant = await Restaurant.create({
      name,
      description,
      address,
      city,
      country,
      images,
      menu,
      openingHours,
      capacity,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      restaurant,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate("createdBy", "name email");

    return res.json({
      success: true,
      restaurants,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    return res.json({
      success: true,
      restaurant,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    // sécurité propriétaire
    if (!req.user || restaurant.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    restaurant.name = req.body.name ?? restaurant.name;
    restaurant.description = req.body.description ?? restaurant.description;
    restaurant.images = req.body.images ?? restaurant.images;
    restaurant.city = req.body.city ?? restaurant.city;
    restaurant.country = req.body.country ?? restaurant.country;

    // si tu veux garder price (sinon supprime cette ligne)
    if (req.body.price !== undefined) {
      restaurant.price = req.body.price;
    }

    const updated = await restaurant.save();

    return res.status(200).json({
      success: true,
      restaurant: updated,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    if (restaurant.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await restaurant.deleteOne();

    return res.json({
      success: true,
      message: "Restaurant deleted",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};