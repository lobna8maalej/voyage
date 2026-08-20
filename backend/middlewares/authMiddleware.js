import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {

    // ==========================================
    // RÉCUPÉRER LE TOKEN
    // ==========================================

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Token manquant",
      });
    }

    const token = authHeader.split(" ")[1];

    // ==========================================
    // VÉRIFIER LE TOKEN
    // ==========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ==========================================
    // RÉCUPÉRER L'UTILISATEUR
    // ==========================================

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // ==========================================
    // AJOUTER USER À LA REQUÊTE
    // ==========================================

    req.user = user;

    next();

  } catch (error) {

    console.error(
      "❌ AUTH ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Utilisateur non authentifié",
    });
  }
};