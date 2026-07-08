import { useEffect, useState } from "react";
import api from "./axios";

interface Restaurant {
  _id: string;
  name: string;
  city: string;
  country: string;
  images?: string[];
}

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  
  const fetchRestaurants = async () => {
    try {
      const res = await api.get("/services/type/restaurant");
      const data = res.data?.data ?? res.data ?? [];
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("GET RESTAURANTS ERROR:", err);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);


  if (loading) {
    return <p style={{ padding: 20 }}>Loading restaurants...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🍽️ Restaurants</h2>

      {restaurants.length === 0 ? (
        <p>No restaurants found</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
          }}
        >
          {restaurants.map((r) => (
            <div
              key={r._id}
              style={{
                border: "1px solid #ddd",
                padding: 10,
                borderRadius: 8,
              }}
            >
              {r.images?.map((img) => (
                <img
                  key={img}
                  src={img}
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                  }}
                />
              ))}

              <h3>{r.name}</h3>
              <p>
                {r.city} - {r.country}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;