import { useEffect, useState } from "react";
import api from "./axios";

type Room = {
  _id: string;
  title: string;
  description: string;
  price: number;
  capacity: number;
  image: string;
  available: boolean;
  location: string;
};

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data || []);
    } catch (error) {
      console.log("GET ROOMS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: 20 }}>Loading rooms...</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>🏨 Rooms</h2>

      {rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        rooms.map((room) => (
          <div
            key={room._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              marginBottom: 20,
              maxWidth: 500,
            }}
          >
            {room.image && (
              <img
                src={room.image}
                alt={room.title}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              />
            )}

            <h3>{room.title}</h3>

            <p>{room.description}</p>

            <p>
              <strong>💰 Price:</strong> {room.price} TND
            </p>

            <p>
              <strong>👥 Capacity:</strong> {room.capacity} persons
            </p>

            <p>
              <strong>📍 Location:</strong> {room.location}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: room.available ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {room.available ? "Available" : "Unavailable"}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Rooms;