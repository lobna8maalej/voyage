import Contact from "../models/Contact.js";

// ========================================
// CREATE CONTACT
// ========================================
export const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    // Vérifier les champs obligatoires
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Le nom, l'email et le message sont obligatoires",
      });
    }

    // Créer le contact
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message envoyé avec succès",
      data: contact,
    });
  } catch (error) {
    console.error(
      "❌ Erreur création contact :",
      error
    );

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// ========================================
// GET ALL CONTACTS
// ========================================
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error(
      "❌ Erreur récupération contacts :",
      error
    );

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// ========================================
// GET CONTACT BY ID
// ========================================
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(
      req.params.id
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact introuvable",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error(
      "❌ Erreur récupération contact :",
      error
    );

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE CONTACT
// ========================================
export const updateContact = async (req, res) => {
  try {
    const contact =
      await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact introuvable",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact mis à jour avec succès",
      data: contact,
    });
  } catch (error) {
    console.error(
      "❌ Erreur modification contact :",
      error
    );

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// ========================================
// DELETE CONTACT
// ========================================
export const deleteContact = async (req, res) => {
  try {
    const contact =
      await Contact.findByIdAndDelete(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact introuvable",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact supprimé avec succès",
    });
  } catch (error) {
    console.error(
      "❌ Erreur suppression contact :",
      error
    );

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};