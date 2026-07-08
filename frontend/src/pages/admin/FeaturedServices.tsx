import { useEffect, useState } from "react";
import api from "./axios";

interface Service {
  _id: string;
  name: string;
  type: string;
  city: string;
  country: string;
  images?: string[];
}

const FeaturedServices = () => {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);

  // ================= FETCH FEATURED =================
  useEffect(() => {
    api.get("/services/featured").then((res) => {
      setFeaturedServices(res.data);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>⭐ Featured Services</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {featuredServices.map((s) => (
          <div
            key={s._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {/* IMAGE */}
            <img
              src={s.images?.[0] || "https://via.placeholder.com/300"}
              alt={s.name}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
              }}
            />

            {/* CONTENT */}
            <div style={{ padding: 10 }}>
              <h3>{s.name}</h3>
              <p>🏷️ {s.type}</p>
              <p>📍 {s.city} - {s.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedServices;