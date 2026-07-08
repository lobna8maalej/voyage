import QRCode from "qrcode";

export const generateQR = async (booking) => {
  const url = `http://localhost:5173/guest/${booking._id}`;

  const qrCode = await QRCode.toDataURL(url);

  // Vérifie que booking est bien un document mongoose
  if (booking?.save) {
    booking.qrCode = qrCode;
    await booking.save();
  }

  return qrCode;
};