import express from "express";
import { upload } from "../middlewares/upload.js";

import {
  getAvailableRooms,
  updateRoomImage,
  getRoomById,
  getRooms,
  createRoom
} from "../controllers/room.controller.js";

const router = express.Router();

// 👉 GET ALL ROOMS
router.get("/", getRooms);

// 👉 GET AVAILABLE ROOMS
router.get("/available", getAvailableRooms);

// 👉 GET ROOM BY ID
router.get("/:id", getRoomById);

// 👉 CREATE ROOM (upload image)
router.post("/", upload.single("image"), createRoom);

// 👉 UPDATE ROOM IMAGE
router.put("/:id/image", upload.single("image"), updateRoomImage);

export default router;