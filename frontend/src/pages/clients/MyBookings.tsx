import { useEffect, useState } from "react";
import api from "../admin/axios";

type Booking = {
  _id: string;

  user?: {
    name: string;
    email: string;
  };

  service?: {
    name: string;
    type: string;
  };

  persons: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;

  qrCode?: string;
  qrToken?: string;
};

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingQR, setLoadingQR] = useState<string | null>(null);

  // ================= GET BOOKINGS =================
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ================= PAY =================
 const handlePay = async (bookingId: string) => {
  try {
    const res = await api.post("/payments/checkout", {
      bookingId,
    });

    // si backend renvoie une URL Stripe
    if (res.data?.url) {
      window.location.href = res.data.url;
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("Erreur lors du paiement");
  }
};
  const handleCheckIn = async (bookingId: string) => {
    try {
      await api.put(`/bookings/${bookingId}/check-in`);

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "checked-in" } : b
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ================= VERIFY QR (IMPORTANT) =================
  const handleVerifyQR = async (bookingId: string, token: string) => {
    try {
      const res = await api.post(
        "http://localhost:5000/api/qr/verify",
        {
          bookingId,
          token,
        }
      );

      alert(res.data.message); // 👉 "Check-in success"

      // update UI
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, status: "checked-in" }
            : b
        )
      );

    } catch (err: any) {
      console.log(err);
      alert(err.response?.data?.message || "QR Error");
    }
  };

  
  const handleGenerateQR = async (bookingId: string) => {
    try {
      setLoadingQR(bookingId);

      const res = await api.post("/qr/generate", {
        bookingId,
      });

      const qrCode = res.data.qrCode;

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, qrCode } : b
        )
      );
    } catch (err) {
      console.log("QR ERROR:", err);
    } finally {
      setLoadingQR(null);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2> Bookings</h2>

      {bookings.map((b) => (
        <div key={b._id} style={card}>

          
          <h3> {b.user?.name}</h3>
          <p> {b.user?.email}</p>

      
          <p> Service: {b.service?.name}</p>
          <p> Type: {b.service?.type}</p>

          {/* INFO */}
          <p> Persons: {b.persons}</p>
          <p> Total: {b.totalPrice} TND</p>

          <p> Status: {b.status}</p>

          <p>
            Payment:{" "}
            <b style={{ color: b.paymentStatus === "paid" ? "green" : "red" }}>
              {b.paymentStatus}
            </b>
          </p>

          <p> {new Date(b.createdAt).toLocaleDateString()}</p>

          {/* PAY */}
          {b.paymentStatus !== "paid" && (
            <button onClick={() => handlePay(b._id)}>
               Pay
            </button>
          )}

          {/* CHECK-IN */}
          <button onClick={() => handleCheckIn(b._id)}>
             Check-in
          </button>

          {/* VERIFY QR (IMPORTANT) */}
          {b.qrToken && (
            <button
              onClick={() => handleVerifyQR(b._id, b.qrToken!)}
              style={{ marginLeft: 10 }}
            >
               Verify QR
            </button>
          )}

         
          {b.paymentStatus === "paid" && !b.qrCode && (
            <button
              onClick={() => handleGenerateQR(b._id)}
              disabled={loadingQR === b._id}
              style={{ marginLeft: 10 }}
            >
               {loadingQR === b._id ? "Generating..." : "Generate QR"}
            </button>
          )}

          {/* QR IMAGE */}
          {b.qrCode && (
            <div style={{ marginTop: 10 }}>
              <img src={b.qrCode} width={120} />
            </div>
          )}

        </div>
      ))}
    </div>
  );
};

const card = {
  border: "1px solid #ddd",
  padding: 15,
  marginBottom: 10,
  borderRadius: 10,
};

export default Bookings;