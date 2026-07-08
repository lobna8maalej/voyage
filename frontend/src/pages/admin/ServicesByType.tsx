import { useEffect, useState } from "react";
import api from "./axios";
import { useParams } from "react-router-dom";

interface Service {
  _id: string;
  name: string;
  images?: string[];
  city?: string;
  country?: string;
  type: string;
}

const ServicesByType = () => {
  const { type } = useParams(); // restaurant | spa | hotel | circuit | offer

  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (!type) return;

    api.get(`/services/type/${type}`).then((res) => {
      setServices(res.data);
    });
  }, [type]);

  return (
    <div style={{ padding: 20 }}>
      <h2>📌 {type?.toUpperCase()} Services</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
        {services.map((s) => (
          <div key={s._id} style={{ border: "1px solid #ddd", borderRadius: 10 }}>
            
            {/* IMAGES */}
            <img
              src={s.images?.[0] || "https://via.placeholder.com/400"}
              style={{ width: "100%", height: 180, objectFit: "cover" }}
            />

            <div style={{ padding: 10 }}>
              <h3>{s.name}</h3>
              <p>{s.city} - {s.country}</p>
              <p>Type: {s.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesByType;