import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "./axios";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data);
      } catch (err) {
        console.log("Room not found", err);
      }
    };

    if (id) fetchRoom();
  }, [id]);

  if (!room) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{room.title}</h1>

      <img
        src={room.image}
        style={{ width: 400, borderRadius: 10 }}
      />

      <p>{room.description}</p>
      <p>{room.location}</p>
      <p>{room.price} TND</p>
    </div>
  );
};

export default RoomDetails;