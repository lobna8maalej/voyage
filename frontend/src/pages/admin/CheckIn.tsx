import { useEffect, useState } from "react";
import api from "./axios";

const CheckIn = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 🔥 ANIMATION EMAIL / WHATSAPP
  const [sending, setSending] = useState({
    email: false,
    whatsapp: false,
  });

  // ================= LIVE POLLING =================
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get("/bookings/admin");
        setBookings(res.data);
      } catch (error) {
        console.log(error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ================= CHECK-IN =================
  const handleCheckIn = async (bookingId: string) => {
    try {
      setLoadingId(bookingId);

      // 🔥 animation start
      setSending({ email: true, whatsapp: true });

      const res = await api.put(`/bookings/checkin/${bookingId}`);

      // update booking dans UI
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? res.data.booking : b
        )
      );

      // 🔥 animation stop
      setSending({ email: false, whatsapp: false });

    } catch (error) {
      console.log(error);
      setSending({ email: false, whatsapp: false });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Check-In Dashboard</h2>

      {/* ================= BOOKINGS ================= */}
      {bookings.map((b) => (
        <div
          key={b._id}
          style={{
            border: "1px solid #ddd",
            padding: 15,
            marginBottom: 10,
            borderRadius: 10,
          }}
        >
          <h3>{b.room?.title}</h3>

          <p>
            Status: <b>{b.checkInStatus}</b>
          </p>

          <p>
            WhatsApp:{" "}
            <b style={{ color: "blue" }}>
              {b.whatsappStatus}
            </b>
          </p>

          {/* BUTTON */}
          <button
            onClick={() => handleCheckIn(b._id)}
            disabled={loadingId === b._id}
            style={{
              padding: 10,
              background: "#635bff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {loadingId === b._id
              ? "Processing..."
              : b.checkInStatus === "checked-in"
              ? "✔ Already Checked-in"
              : "Confirm Check-in"}
          </button>
        </div>
      ))}

      {/* ================= ANIMATION ================= */}
      <div style={{ marginTop: 20 }}>
        {sending.email && (
          <p style={{ color: "blue" }}>
            📧 Sending Email...
          </p>
        )}

        {sending.whatsapp && (
          <p style={{ color: "green" }}>
            💬 Sending WhatsApp...
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckIn;