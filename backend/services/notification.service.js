import { sendBookingEmail } from "./email.service.js";
import { sendWhatsApp } from "./whatsapp.service.js";

export const sendCheckInNotification = async (booking) => {
  const emailHtml = `
    <h2>🏨 Check-in Confirmed</h2>
    <p>Room: ${booking.room.title}</p>
    <p>Check-in: ${booking.checkIn}</p>
    <p>Check-out: ${booking.checkOut}</p>
  `;

  await sendBookingEmail(booking);

  await sendWhatsApp(booking);
};