import { useEffect, useState } from "react";
import api from "./axios";

type Spa = {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  images: string[];
  price: number;
  currency: string;
  city: string;
  country: string;
  rating: number;
  available: boolean;
};

const Spa = () => {
  const [spas, setSpas] = useState<Spa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpa();
  }, []);

  const fetchSpa = async () => {
    try {
      const res = await api.get("/services/type/spa");
      setSpas(res.data || []);
    } catch (error) {
      console.log("GET SPA ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: 20 }}>Loading spa services...</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}> Spa Services</h2>

      {spas.length === 0 ? (
        <p>No spa services found.</p>
      ) : (
        spas.map((spa) => (
          <div
            key={spa._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              marginBottom: 20,
              maxWidth: 500,
            }}
          >
            {spa.images?.length > 0 && (
              <img
                src={spa.images[0]}
                alt={spa.name}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              />
            )}

            <h3>{spa.name}</h3>

            <p>{spa.description}</p>

            <p>
              <strong> Price:</strong> {spa.price} {spa.currency}
            </p>

            <p>
              <strong> Location:</strong> {spa.city}, {spa.country}
            </p>

            <p>
              <strong> Rating:</strong> {spa.rating}/5
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: spa.available ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {spa.available ? "Available" : "Unavailable"}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Spa;