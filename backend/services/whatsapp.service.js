import twilio from "twilio";
import { generateWhatsAppMessage } from "./ai.service.js";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendWhatsApp = async (booking) => {
  try {
    const aiMessage = await generateWhatsAppMessage(booking);

    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${booking.user.phone}`,
      body: aiMessage,

      statusCallback:
        "https://corrosive-plywood-spoiling.ngrok-free.app/api/twilio/status",
    });

    return {
      success: true,
      sid: message.sid,
      status: message.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};