import { useEffect, useState } from "react";
import api from "./axios";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/bookings").then(res => setBookings(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🧑‍💼 Admin Bookings</h2>

      {bookings.map((b: any) => (
        <div key={b._id} style={card}>

          <h3>👤 {b.user?.name}</h3>
          <p>📧 {b.user?.email}</p>

          <h4>{b.service?.name}</h4>

          <p>👥 {b.persons}</p>
          <p>💰 {b.totalPrice} TND</p>

          <p>Status: {b.status}</p>

          <button>
            ✅ Check-in
          </button>

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