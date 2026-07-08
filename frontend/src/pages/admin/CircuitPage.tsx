import { useEffect, useState } from "react";
import api from "./axios";

interface Circuit {
  _id: string;
  name: string;
  city: string;
  country: string;
  images?: string[];
}

const CircuitPage = () => {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= GET CIRCUITS ONLY =================
  const fetchCircuits = async () => {
    try {
      const res = await api.get("/services/type/circuit");

      const data = res.data?.data ?? res.data ?? [];
      setCircuits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("GET CIRCUITS ERROR:", err);
      setCircuits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCircuits();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return <p style={{ padding: 20 }}>Loading circuits...</p>;
  }

  // ================= UI =================
  return (
    <div style={{ padding: 20 }}>
      <h2>🧭 Circuits List</h2>

      {circuits.length === 0 ? (
        <p>No circuits found</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
          }}
        >
          {circuits.map((c) => (
            <div
              key={c._id}
              style={{
                border: "1px solid #ddd",
                padding: 10,
                borderRadius: 10,
              }}
            >
              {c.images?.map((img) => (
                <img
                  key={img}
                  src={img}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              ))}

              <h3>{c.name}</h3>
              <p>
                {c.city} - {c.country}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CircuitPage;
