import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateBookingMessage = async (booking) => {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a luxury hotel assistant.",
      },
      {
        role: "user",
        content: `
Write a short luxury booking confirmation message.

Guest: ${booking.user?.username || "Guest"}
Service: ${booking.service?.name || "Hotel"}
Check-in: ${booking.checkIn}
        `,
      },
    ],
  });

  return res.choices[0].message.content;
};
