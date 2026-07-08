import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../admin/axios";

const DetailsPage = () => {
  const { type, id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!type || !id) {
          setData(null);
          setLoading(false);
          return;
        }

        let url = "";

        switch (type) {
          case "destination":
            url = `/destinations/${id}`;
            break;
          case "restaurant":
            url = `/restaurants/${id}`;
            break;
          case "spa":
            url = `/spa/${id}`;
            break;
          case "circuit":
            url = `/circuits/${id}`;
            break;
          case "agency":
            url = `/agency/${id}`;
            break;
          case "offer":
            url = `/offers/${id}`;
            break;
          case "hotel":
            url = `/hotels/${id}`; // si tu as hotels
            break;
          default:
            url = `/services/${id}`;
        }

        const res = await api.get(url);
        setData(res.data);
      } catch (err) {
        console.log(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  if (loading) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  if (!data) return <h2 style={{ padding: 20 }}>No data found</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.name || data.city}</h1>

      <p><b>Ville:</b> {data.city}</p>
      <p><b>Pays:</b> {data.country}</p>
      <p><b>Description:</b> {data.description}</p>
      <p><b>Prix:</b> {data.price} TND</p>

      {data.image && (
        <img
          src={data.image}
          alt={data.name}
          style={{ width: 300, borderRadius: 10 }}
        />
      )}
    </div>
  );
};

export default DetailsPage;