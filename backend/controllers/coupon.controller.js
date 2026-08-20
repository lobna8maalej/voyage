import Coupon from "../models/Coupon.js";

// =====================================================
// CREATE COUPON
// =====================================================

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discount,
      expireDate,
    } = req.body;

    const existing = await Coupon.findOne({
      code,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Coupon already exists",
      });
    }

    const coupon = await Coupon.create({
      code,
      discount,
      expireDate,
    });

    return res.status(201).json({
      success: true,
      coupon,
    });

  } catch (error) {
    console.error(
      "❌ Erreur création coupon :",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET ALL COUPONS
// =====================================================

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      coupons,
    });

  } catch (error) {
    console.error(
      "❌ Erreur récupération coupons :",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// VALIDATE COUPON
// =====================================================

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        valid: false,
        message: "Code promo manquant",
      });
    }

    const coupon = await Coupon.findOne({
      code,
    });

    if (!coupon) {
      return res.status(404).json({
        valid: false,
        message: "Coupon not found",
      });
    }

    if (coupon.expireDate < new Date()) {
      return res.status(400).json({
        valid: false,
        message: "Coupon expired",
      });
    }

    if (!coupon.active) {
      return res.status(400).json({
        valid: false,
        message: "Coupon inactive",
      });
    }

    return res.status(200).json({
      success: true,
      valid: true,
      discount: coupon.discount,
      coupon,
    });

  } catch (error) {
    console.error(
      "❌ Erreur validation coupon :",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// USE / COPY COUPON
// =====================================================

export const useCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon introuvable",
      });
    }

    // Vérifier expiration
    if (coupon.expireDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Coupon expiré",
      });
    }

    // Vérifier activation
    if (!coupon.active) {
      return res.status(400).json({
        success: false,
        message: "Coupon désactivé",
      });
    }

    // Incrémenter le compteur
    coupon.usageCount =
      (coupon.usageCount || 0) + 1;

    await coupon.save();

    return res.status(200).json({
      success: true,
      message:
        "Utilisation du coupon enregistrée",
      coupon,
    });

  } catch (error) {
    console.error(
      "❌ Erreur utilisation coupon :",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET COUPON BY ID
// =====================================================

export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(
      req.params.id
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      coupon,
    });

  } catch (error) {
    console.error(
      "❌ Erreur récupération coupon :",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE COUPON
// =====================================================

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(
      req.params.id
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const updated = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      coupon: updated,
    });

  } catch (error) {
    console.error(
      "❌ Erreur modification coupon :",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// DELETE COUPON
// =====================================================

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(
      req.params.id
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await coupon.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Coupon deleted",
    });

  } catch (error) {
    console.error(
      "❌ Erreur suppression coupon :",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};