export const adminMiddleware = (req, res, next) => {
  try {
    // Vérifier que l'utilisateur est connecté
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié",
      });
    }

    // Vérifier le rôle
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Accès refusé : administrateur uniquement",
      });
    }

    next();

  } catch (error) {
    console.error("❌ ADMIN MIDDLEWARE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};