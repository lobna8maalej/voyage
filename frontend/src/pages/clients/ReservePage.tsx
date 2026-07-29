import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../admin/axios";
import "./ReservePage.css";

type Item = {
  _id: string;

  name?: string;
  title?: string;
  description?: string;
  summary?: string;

  price?: number;
  discount?: number;

  city?: string;
  country?: string;
  location?: string;

  image?: string;
  imageUrl?: string;
  images?: string[];
  photo?: string;
  cover?: string;

  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  openingHours?: string;

  code?: string;
  coupon?: string;
  expiryDate?: string;
  validUntil?: string;

  destination?:
    | string
    | {
        name?: string;
        city?: string;
        country?: string;
        description?: string;
      };

  programs?: string[];
  includes?: string[];
  activities?: string[];
  services?: string[];

  stars?: number;
  rating?: number;
  duration?: string;
  cuisine?: string;
  priceRange?: string;
  bestSeason?: string;

  wifi?: boolean;
  pool?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  airConditioning?: boolean;

  license?: string;
  yearsExperience?: number;

  agency?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
    openingHours?: string;
  };
};

const FALLBACK =
  "https://res.cloudinary.com/dgdemj83g/image/upload/v1782842430/The-Voyage-With-Water-Tower-from-Drone_javckd.webp";

export default function ReservePage() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState<Item | null>(null);
  const [error, setError] = useState("");

  const map: Record<string, string> = {
    hotel: "/hotels",
    agency: "/agency",
    circuit: "/circuits",
    restaurant: "/restaurants",
    spa: "/spa",
    destination: "/destinations",
    offer: "/offers",
    coupon: "/coupons",
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        const endpoint = map[type?.toLowerCase() || ""];

        if (!endpoint) {
          setError("Type de service invalide");
          return;
        }

        const response = await api.get(`${endpoint}/${id}`);

        let data = response.data;

        if (response.data.hotel) data = response.data.hotel;
        else if (response.data.agency) data = response.data.agency;
        else if (response.data.circuit) data = response.data.circuit;
        else if (response.data.restaurant) data = response.data.restaurant;
        else if (response.data.spa) data = response.data.spa;
        else if (response.data.destination) data = response.data.destination;
        else if (response.data.offer) data = response.data.offer;
        else if (response.data.coupon) data = response.data.coupon;
        else if (response.data.data) data = response.data.data;

        console.log("SERVICE :", data);

        setService(data);
      } catch (err) {
        console.error(err);
        setError("Service introuvable");
      }
    };

    if (type && id) {
      fetchService();
    }
  }, [type, id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!service) {
    return <p>Chargement...</p>;
  }

  /* ================= VARIABLES ================= */

const image =
  service.images?.[0] ||
  service.image ||
  service.imageUrl ||
  service.photo ||
  service.cover ||
  FALLBACK;

const title =
  service.name ||
  service.title ||
  service.agency?.name ||
  "Service";


const destination =
  typeof service.destination === "string"
    ? service.destination
    : service.destination?.name ||
      service.destination?.city ||
      service.destination?.country ||
      service.city ||
      service.country ||
      service.location ||
      "";


// CONTACT AGENCE
const phone =
  service.phone ||
  service.agency?.phone ||
  "+216 71 563 022";


const email =
  service.email ||
  service.agency?.email ||
  "contact@darelmedina.com";


const address =
  service.address ||
  service.agency?.address ||
  "Rue Sidi Ben Arous, Tunis";


const openingHours =
  service.openingHours ||
  service.agency?.openingHours ||
  "";


const website =
  service.website ||
  service.agency?.website ||
  "https://darelmedinatunis.com";


const websiteUrl = website
  ? website.startsWith("http")
    ? website
    : `https://${website}`
  : null;



const services = service.services ?? [];
const activities = service.activities ?? [];
const includes = service.includes ?? [];
/* ================= RETURN ================= */

return (
  <div className="reserve-page">
    <div className="reserve-card">

      <img
        className="reserve-image"
        src={image}
        alt={title}
        onError={(e) => {
          e.currentTarget.src = FALLBACK;
        }}
      />

      <div className="reserve-content">

        <h1 className="reserve-title">
          {title}
        </h1>

        <p className="reserve-location">
          📍 {destination}
        </p>

        <p className="reserve-description">
          {service.description ||
            (typeof service.destination === "object"
              ? service.destination?.description
              : "") ||
            service.summary ||
            service.programs?.join(" • ") ||
            "Description prochainement disponible."}
        </p>

        {service.price &&
          !["hotel", "spa", "offer", "circuit"].includes(type || "") && (
            <div className="reserve-price">
              💰 {service.price} TND
            </div>
        )}

        {type === "hotel" && (
          <>
            {service.stars && (
              <div className="info-item">
                ⭐ <strong>Étoiles :</strong>{" "}
                {"⭐".repeat(service.stars)}
              </div>
            )}

            {service.price && (
              <div className="reserve-price">
                💰 {service.price} TND / nuit
              </div>
            )}

            {service.wifi && (
              <div className="info-item">
                📶 Wi-Fi gratuit
              </div>
            )}

            {service.pool && (
              <div className="info-item">
                🏊 Piscine
              </div>
            )}

            {service.parking && (
              <div className="info-item">
                🚗 Parking
              </div>
            )}

            {service.breakfast && (
              <div className="info-item">
                ☕ Petit-déjeuner inclus
              </div>
            )}

            {service.airConditioning && (
              <div className="info-item">
                ❄ Climatisation
              </div>
            )}

            <button
              className="availability-btn"
              onClick={() =>
                navigate(`/availability/${type}/${id}`)
              }
            >
              🏨 Réserver
            </button>
          </>
        )}

        {/* ================= RESTAURANT ================= */}

        {type === "restaurant" && (
          <>
            {service.cuisine && (
              <div className="info-item">
                🍽 <strong>Cuisine :</strong> {service.cuisine}
              </div>
            )}

            {service.priceRange && (
              <div className="info-item">
                💰 <strong>Fourchette :</strong>{" "}
                {service.priceRange}
              </div>
            )}

            {openingHours && (
              <div className="info-item">
                🕒 <strong>Horaires :</strong>{" "}
                {openingHours}
              </div>
            )}

            {service.rating && (
              <div className="info-item">
                ⭐ <strong>Note :</strong>{" "}
                {service.rating}/5
              </div>
            )}

            <button
              className="availability-btn"
              onClick={() =>
                navigate(`/availability/${type}/${id}`)
              }
            >
              🍴 Réserver une table
            </button>
          </>
        )}

        {/* ================= SPA ================= */}

        {type === "spa" && (
          <>
            {service.duration && (
              <div className="info-item">
                ⏱ <strong>Durée :</strong>{" "}
                {service.duration}
              </div>
            )}

            {services.length > 0 && (
              <div className="info-item">
                💆 <strong>Prestations :</strong>{" "}
                {services.join(" • ")}
              </div>
            )}

            {service.price && (
              <div className="reserve-price">
                💰 {service.price} TND
              </div>
            )}

            {service.rating && (
              <div className="info-item">
                ⭐ <strong>Note :</strong>{" "}
                {service.rating}/5
              </div>
            )}

            <button
              className="availability-btn"
              onClick={() =>
                navigate(`/availability/${type}/${id}`)
              }
            >
              💆 Réserver une séance
            </button>
          </>
        )}

                {/* ================= DESTINATION ================= */}

        {type === "destination" && (
          <>
            {service.country && (
              <div className="info-item">
                🌍 <strong>Pays :</strong>{" "}
                {service.country}
              </div>
            )}

            {service.bestSeason && (
              <div className="info-item">
                ☀ <strong>Meilleure saison :</strong>{" "}
                {service.bestSeason}
              </div>
            )}

            {service.rating && (
              <div className="info-item">
                ⭐ <strong>Note :</strong>{" "}
                {service.rating}/5
              </div>
            )}

            {activities.length > 0 && (
              <div className="info-item">
                🎯 <strong>Activités :</strong>{" "}
                {activities.join(" • ")}
              </div>
            )}

            <button
              className="availability-btn"
              onClick={() =>
                navigate(`/availability/${type}/${id}`)
              }
            >
              👁 Voir disponibilité
            </button>
          </>
        )}


        {type === "offer" && (
          <>
            {service.destination && (
              <div className="info-item">

                📍 <strong>Destination :</strong>{" "}

                {typeof service.destination === "object"
                  ? service.destination.name ||
                    service.destination.city ||
                    service.destination.country
                  : service.destination}

              </div>
            )}


            {service.duration && (
              <div className="info-item">
                🗓 <strong>Durée :</strong>{" "}
                {service.duration}
              </div>
            )}


            {service.discount && (
              <div className="info-item">
                🎁 <strong>Réduction :</strong>{" "}
                {service.discount}%
              </div>
            )}


            {service.validUntil && (
              <div className="info-item">
                📅 <strong>Valable jusqu'au :</strong>{" "}
                {service.validUntil}
              </div>
            )}



            {includes.length > 0 && (
              <div className="info-item">

                ✔ <strong>Inclus :</strong>

                <ul>
                  {includes.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>

              </div>
            )}



            {service.price && (
              <div className="reserve-price">
                💰 {service.price} TND
              </div>
            )}



            <button
              className="availability-btn"
              onClick={() =>
                navigate(`/availability/${type}/${id}`)
              }
            >
              🎁 Réserver l'offre
            </button>

          </>
        )}




        {/* ================= COUPON ================= */}


        {type === "coupon" && (
          <>
            <div className="coupon-code">

              🎫 <strong>Code promo</strong>

              <h2>
                {service.code ||
                  service.coupon ||
                  "Aucun code disponible"}
              </h2>

            </div>



            {service.discount && (
              <div className="info-item">

                💸 <strong>Réduction :</strong>{" "}
                {service.discount}%

              </div>
            )}



            {service.expiryDate && (
              <div className="info-item">

                📅 <strong>Expire le :</strong>{" "}
                {service.expiryDate}

              </div>
            )}



            <button
              className="availability-btn"
              onClick={() => {

                const code =
                  service.code ||
                  service.coupon;


                if(code){

                  navigator.clipboard.writeText(code);

                  alert(
                    "Le code promo a été copié !"
                  );

                }

              }}
            >

              📋 Copier le code

            </button>


          </>
        )}

                {/* ================= CIRCUIT ================= */}

        {type === "circuit" && (
<>
  <div className="info-item">
    🌍 <strong>Agence :</strong>{" "}
    {service.agency?.name || "Agence touristique"}
  </div>


  {service.price && (
    <div className="reserve-price">
      💰 {service.price} TND
    </div>
  )}


  {service.destination && (
    <div className="info-item">
      📍 <strong>Destination :</strong>{" "}
      {
        typeof service.destination === "object"
        ? service.destination.name ||
          service.destination.city ||
          service.destination.country
        : service.destination
      }
    </div>
  )}


  <button
    className="availability-btn"
    onClick={() =>
      navigate(`/availability/${type}/${id}`)
    }
  >
    🌍 Voir disponibilité
  </button>

</>
)}



        {/* ================= AGENCY ================= */}


        {type === "agency" && (
          <>
            {service.license && (
              <div className="info-item">
                ✔ <strong>Licence :</strong>{" "}
                {service.license}
              </div>
            )}


            {service.yearsExperience && (
              <div className="info-item">
                📅 <strong>Expérience :</strong>{" "}
                {service.yearsExperience} ans
              </div>
            )}


            {service.rating && (
              <div className="info-item">
                ⭐ <strong>Note :</strong>{" "}
                {service.rating}/5
              </div>
            )}


            <button
              className="availability-btn"
              onClick={() =>
                navigate(`/availability/${type}/${id}`)
              }
            >
              ✈ Contacter l'agence
            </button>

          </>
        )}





        
{["hotel", "restaurant", "spa", "agency", "circuit"].includes(type || "") && (
  <div className="contact-box">

    <div className="contact-title">
      📞 Contact
    </div>

    {phone && (
      <div className="contact-item">
        📱 <a href={`tel:${phone}`}>{phone}</a>
      </div>
    )}

    {email && (
      <div className="contact-item">
        ✉️ <a href={`mailto:${email}`}>{email}</a>
      </div>
    )}

    {websiteUrl && (
      <div className="contact-item">
        🌐
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visiter le site web
        </a>
      </div>
    )}

    {address && (
      <div className="contact-item">
        📍 {address}
      </div>
    )}

   

  </div>
)}
        {/* ================= RETOUR ================= */}


        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >

          ⬅ Retour

        </button>


      </div>

    </div>

  </div>
);
}