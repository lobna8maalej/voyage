import express from "express";

import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";

const router = express.Router();

// ========================================
// CREATE CONTACT
// POST /api/contacts
// ========================================

router.post("/", createContact);

// ========================================
// GET ALL CONTACTS
// GET /api/contacts
// ========================================

router.get("/", getContacts);

// ========================================
// GET CONTACT BY ID
// GET /api/contacts/:id
// ========================================

router.get("/:id", getContactById);

// ========================================
// UPDATE CONTACT
// PUT /api/contacts/:id
// ========================================

router.put("/:id", updateContact);

// ========================================
// DELETE CONTACT
// DELETE /api/contacts/:id
// ========================================

router.delete("/:id", deleteContact);

export default router;