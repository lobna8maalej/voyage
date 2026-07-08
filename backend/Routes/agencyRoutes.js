import express from "express";
import { upload } from "../middlewares/upload.js";

import {
  createAgency,
  getAgencies,
  updateAgency,
  getAgency
} from "../controllers/agencyController.js";

const router = express.Router();



// CREATE AGENCY
router.post("/", createAgency);
 router.get("/:id", getAgency);

router.get("/", getAgencies);

router.put("/:id", updateAgency);


export default router;