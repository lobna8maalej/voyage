import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "./axios";

const Dashboard = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [persons, setPersons] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleReserve = async () => {
    try {
      setLoading(true);

      console.log("Sending booking...");

      const res = await api.post("/bookings", {
        service: serviceId,
        persons,
      });

      console.log("BOOKING SUCCESS:", res.data);

      alert("Réservation réussie");

      navigate("/bookings");

    } catch (err: any) {
      console.log("BOOKING ERROR:", err.response?.data || err.message);
      alert("Erreur réservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Réserver</h2>

      <input
        type="number"
        value={persons}
        onChange={(e) => setPersons(Number(e.target.value))}
        min={1}
      />

      <button onClick={handleReserve} disabled={loading}>
        {loading ? "Loading..." : "Réserver"}
      </button>
    </div>
  );
};

export default Dashboard;