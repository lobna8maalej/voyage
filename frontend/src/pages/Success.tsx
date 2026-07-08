import { useEffect, useState } from "react";
import api from "./admin/axios";
import { useLocation } from "react-router-dom";

type Booking = {
  _id?: string;
  service?: { name?: string; image?: string };
  status?: string;
  paymentStatus?: string;
  totalPrice?: number;
  qrToken?: string;
};

export default function Success() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrStatus, setQrStatus] = useState("");

  const location = useLocation();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingId = new URLSearchParams(location.search).get("bookingId");

        if (!bookingId) {
          setLoading(false);
          return;
        }

        // 1️⃣ GET BOOKING
        const res = await api.get(`/bookings/${bookingId}`);
        const data = res.data;

        setBooking(data);

        // 2️⃣ QR CHECK (optional)
        if (data.qrToken) {
          try {
            const qrRes = await api.post("/qr/verify", {
              bookingId: data._id,
              token: data.qrToken,
            });

            setQrStatus(qrRes.data.message);
          } catch (err) {
            console.log("QR error", err);
            setQrStatus("QR invalid");
          }
        }

      } catch (err) {
        console.log("Fetch booking error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [location.search]);

  if (loading) return <h2>Loading...</h2>;
  if (!booking) return <h2>Aucune réservation trouvée</h2>;

  return (
    <div style={{ padding: 20 }}>

      <h1>🎉 Booking Confirmé</h1>

      <p>Service: {booking.service?.name}</p>
      <p>Status: {booking.status}</p>
      <p>Payment: {booking.paymentStatus}</p>
      <p>Total: {booking.totalPrice} TND</p>

      {/* QR RESULT */}
      {qrStatus && (
        <p style={{ color: "green" }}>
          QR Status: {qrStatus}
        </p>
      )}

      {/* STATUS PAYMENT */}
      {booking.paymentStatus === "paid" ? (
        <p style={{ color: "green" }}>✔ Paiement confirmé</p>
      ) : (
        <p style={{ color: "orange" }}>⏳ En attente de paiement</p>
      )}

    </div>
  );
}