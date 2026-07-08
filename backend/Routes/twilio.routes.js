import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// webhook status update
router.post("/status", async (req, res) => {
  try {
    const { MessageSid, MessageStatus } = req.body;

    console.log("TWILIO UPDATE");
    console.log("SID:", MessageSid);
    console.log("STATUS:", MessageStatus);

    await Booking.updateOne(
      { whatsappSid: MessageSid },
      { whatsappStatus: MessageStatus }
    );

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

export default router;