import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "./axios";

type Booking = {
  _id: string;
  persons: number;
  totalPrice: number;
  checkIn: string;
};

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= GET BOOKINGS =================
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/admin");
      setBookings(res.data || []);
    } catch (err) {
      console.log("GET BOOKINGS ERROR:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  
  const filteredBookings = bookings.filter((b) => {
    return (
      date &&
      new Date(b.checkIn).toDateString() === date.toDateString()
    );
  });

  
  return (
    <div style={{ padding: 20 }}>

      <h2>📅 Booking Calendar</h2>

      {/* CALENDAR */}
      <Calendar
        onChange={(value) => {
          if (value instanceof Date) {
            setDate(value);
          }
        }}
        value={date}
      />

      {/* BOOKINGS LIST */}
      <div style={{ marginTop: 20 }}>
        <h3>Bookings for this day</h3>

        {loading ? (
          <p>Loading...</p>
        ) : filteredBookings.length === 0 ? (
          <p>No bookings for this date</p>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b._id}
              style={{
                border: "1px solid #ddd",
                padding: 10,
                marginTop: 10,
                borderRadius: 8,
              }}
            >
              👤 Persons: {b.persons} <br />
                Total: {b.totalPrice} TND <br />
               Check-in: {new Date(b.checkIn).toLocaleDateString()}
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default CalendarPage;