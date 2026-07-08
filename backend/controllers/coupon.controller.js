import Coupon from "../models/Coupon.js";

// ================= CREATE COUPON =================
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, expireDate } = req.body;

    const existing = await Coupon.findOne({ code });

    if (existing) {
      return res.status(400).json({
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();

    return res.json({
      success: true,
      coupons,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code });

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

    return res.json({
      valid: true,
      discount: coupon.discount,
      coupon,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    const updated = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json({
      success: true,
      coupon: updated,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    await coupon.deleteOne();

    return res.json({
      success: true,
      message: "Coupon deleted",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};