export const EmailTemplate = (booking, aiMessage, qrCode) => {
  return `
    <div style="font-family:Arial;padding:20px">

      <h2>Booking Confirmed</h2>

      <p>${aiMessage || "Thank you for your booking!"}</p>

      <hr/>

      <p><b>Room:</b> ${booking.room.title}</p>
      <p><b>Status:</b> ${booking.status}</p>
      <p><b>Payment:</b> ${booking.paymentStatus}</p>

      <img src="${qrCode}" width="180"/>

      <br/><br/>

      <a href="http://localhost:5173/success?bookingId=${booking._id}">
        View Booking
      </a>

    </div>
  `;
};