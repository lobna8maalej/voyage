import { useState } from "react";
import api from "../pages/admin/axios";

interface Service {
  _id: string;
  name: string;
  type: string;
  city: string;
  country: string;
  description: string;
  price: number;
  currency: string;
  images?: string[];
}

const Filters = () => {
  const [keyword, setKeyword] = useState("");
  const [services, setServices] = useState<Service[]>([]);

  const handleSearch = async () => {
    try {
      const res = await api.get(
        `/services/search?keyword=${encodeURIComponent(keyword)}`
      );
      setServices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Search Services</h2>

      <input
        type="text"
        placeholder="Search hotel, spa, restaurant..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <button onClick={handleSearch}>
        Search
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 20,
          marginTop: 20,
        }}
      >
        {services.map((service) => (
          <div
            key={service._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <img
              src={
                service.images?.[0] ||
                "https://via.placeholder.com/300"
              }
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
              }}
            />

            <h3>{service.name}</h3>

            <p>{service.type}</p>

            <p>
              {service.city} - {service.country}
            </p>

            <p>{service.price} {service.currency}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filters;