import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "./axios";

type Contact = {
  phone: string;
  email: string;
  website: string;
};

const hotelContacts: Record<string, Contact> = {
  Tunisia: {
    phone: "+216 71 563 022",
    email: "contact@darelmedina.com",
    website: "https://darelmedinatunis.com",
  },
  France: {
    phone: "+33 1 45 67 89 10",
    email: "contact@hotellumierparis.fr",
    website: "https://hotellumierparis.fr",
  },
  Turkey: {
    phone: "+90 212 555 12 34",
    email: "contact@bosphorushotel.com",
    website: "https://bosphorushotel.com",
  },
  Egypt: {
    phone: "+20 2 555 1234",
    email: "contact@caironilepalace.com",
    website: "https://caironilepalace.com",
  },
  Ireland: {
    phone: "+353 1 555 1234",
    email: "contact@dublinemeraldbay.com",
    website: "https://dublinemeraldbay.com",
  },
};

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState<any>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    api.get(`/services/${id}`)
      .then((res) => setService(res.data))
      .catch(() => setService(null));
  }, [id]);

  if (!service) return <p>Loading...</p>;

  const images: string[] = service.images || [];
  const contacts = hotelContacts[service.country];

  return (
    <div style={{ padding: 20 }}>

      {/* ================= TITLE ================= */}
      <h1>{service.name}</h1>

      {/* ================= CAROUSEL ================= */}
      {images.length > 0 && (
        <div>
          <img
            src={images[index]}
            style={{
              width: "100%",
              height: 400,
              objectFit: "cover",
              borderRadius: 10,
            }}
          />

          {/* THUMBNAILS */}
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setIndex(i)}
                style={{
                  width: 80,
                  height: 60,
                  objectFit: "cover",
                  cursor: "pointer",
                  border: i === index ? "2px solid black" : "none",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= INFO ================= */}
      <p style={{ marginTop: 10 }}>{service.description}</p>
      <h3>{service.price} TND</h3>

      {/* ================= CONTACT ================= */}
      <div style={{ marginTop: 20 }}>
        <h3>📞 Contact ({service.country})</h3>

        {contacts ? (
          <>
            <p>📞 {contacts.phone}</p>
            <p>📧 {contacts.email}</p>
            <p>🌐 {contacts.website}</p>
          </>
        ) : (
          <p>No contact available</p>
        )}
      </div>
    </div>
  );
}