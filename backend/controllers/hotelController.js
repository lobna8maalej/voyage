import Hotel from "../models/Hotel.js";

// ================= CREATE HOTEL =================
export const createHotel = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      country,
      city,
      images,
      stars,
      amenities,
      price, // 🔥 AJOUT IMPORTANT
    } = req.body;

    const hotel = await Hotel.create({
      name,
      description,
      address,
      country,
      city,
      images,
      stars,
      amenities,
      price, // 🔥 AJOUTÉ
    });

    return res.status(201).json({
      success: true,
      hotel,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL HOTELS =================
export const getHotels = async (req, res) => {
  try {

    const hotels = await Hotel.find();

    res.json({
      success:true,
      hotels
    });


  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};

// ================= GET ONE HOTEL =================
export const getHotel = async (req, res) => {
  try {
    console.log("ID reçu :", req.params.id);

    const hotels = await Hotel.find();
    console.log("Nombre d'hôtels :", hotels.length);

    const hotel = await Hotel.findById(req.params.id);
    console.log("Hotel trouvé :", hotel);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    return res.status(200).json({
      success: true,
      hotel,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE HOTEL =================
export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    const updated = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json({
      success: true,
      hotel: updated,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE HOTEL =================
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    await hotel.deleteOne();

    return res.json({
      success: true,
      message: "Hotel deleted",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel introuvable",
      });
    }

    res.status(200).json({
      success: true,
      data: hotel,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};