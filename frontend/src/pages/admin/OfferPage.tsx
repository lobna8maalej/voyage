import { useEffect, useState } from "react";
import api from "./axios";

const Offers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    api.get("/services/type/offer").then((res) => {
      setOffers(res.data || []);
    });
  }, []);

  return (
    <div>
      <h1>Offers</h1>

      <div className="grid grid-cols-3 gap-4">
        {offers.map((o: any) => (
          <div key={o._id} className="border p-3 rounded">
            <h3>{o.name}</h3>
            <p>{o.city} - {o.country}</p>
            <p>{o.price} TND</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;