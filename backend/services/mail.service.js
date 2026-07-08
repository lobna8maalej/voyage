import nodemailer from "nodemailer";
import { generateBookingMessage } from "./ai.service.js";
import { EmailTemplate } from "./emailTemplate.js";
import { generateQR } from "./qr.service.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendBookingEmail = async (booking) => {
  const aiMessage = await generateBookingMessage(booking);

  const qr = await generateQR(booking);

  const html = EmailTemplate(booking, aiMessage, qr);

  await transporter.sendMail({
    from: `"Hotel System" <${process.env.EMAIL}>`,
    to: booking.user.email,
    subject: "Booking Confirmed",
    html,
  });
};