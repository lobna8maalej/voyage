import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../admin/axios";
import "./ReservePage.css";

/* =====================================================
   TYPES
===================================================== */

type Destination = {
  name?: string;
  city?: string;
  country?: string;
  description?: string;
};

type Agency = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  openingHours?: string;
};

type Item = {
  _id: string;

  /* ============================
     GENERAL
  ============================ */

  name?: string;
  title?: string;

  description?: string;
  summary?: string;

  price?: number;
  discount?: number;

  city?: string;
  country?: string;
  location?: string;

  /* ============================
     IMAGES
  ============================ */

  image?: string;
  imageUrl?: string;
  images?: string[];
  photo?: string;
  cover?: string;

  /* ============================
     CONTACT
  ============================ */

  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  openingHours?: string;

  /* ============================
     ARRAYS
  ============================ */

  programs?: string[];
  includes?: string[];
  activities?: string[];
  services?: string[];

  /* ============================
     HOTEL
  ============================ */

  stars?: number;
  wifi?: boolean;
  pool?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  airConditioning?: boolean;

  /* ============================
     RESTAURANT
  ============================ */

  cuisine?: string;
  rating?: number;
  priceRange?: string;

  /* ============================
     SPA
  ============================ */

  duration?: string;

  /* ============================
     AGENCY
  ============================ */

  license?: string;
  yearsExperience?: number;

  /* ============================
     DESTINATION
  ============================ */

  destination?: string | Destination;
  bestSeason?: string;

  /* ============================
     OFFER
  ============================ */

  validUntil?: string;

  /* ============================
     COUPON
  ============================ */

  code?: string;
  coupon?: string;

  /*
    Backend :
    expireDate
  */
  expireDate?: string;

  /*
    Ancien nom éventuellement
    conservé pour compatibilité
  */
  expiryDate?: string;

  /* ============================
     COUPON STATUT
  ============================ */

  active?: boolean;

  /* ============================
     AGENCY OBJECT
  ============================ */

  agency?: Agency;
};

/* =====================================================
   FALLBACK IMAGE
===================================================== */

const FALLBACK =
  "https://res.cloudinary.com/dgdemj83g/image/upload/v1782842430/The-Voyage-With-Water-Tower-from-Drone_javckd.webp";

/* =====================================================
   COMPONENT
===================================================== */

export default function ReservePage() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  /* =====================================================
     STATES
  ===================================================== */

  const [service, setService] = useState<Item | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =====================================================
     NORMALIZED TYPE
  ===================================================== */

  const normalizedType = type?.toLowerCase() || "";

  /* =====================================================
     API MAP
  ===================================================== */

  const map: Record<string, string> = {
    hotel: "/hotels",
    hotels: "/hotels",

    restaurant: "/restaurants",
    restaurants: "/restaurants",

    spa: "/spa",

    circuit: "/circuits",
    circuits: "/circuits",

    agency: "/agency",
    agencies: "/agency",

    destination: "/destinations",
    destinations: "/destinations",

    offer: "/offers",
    offers: "/offers",

    coupon: "/coupons",
    coupons: "/coupons",
  };

  /* =====================================================
     SERVICE TYPE
  ===================================================== */

  const getServiceType = (): string => {
    switch (normalizedType) {
      case "hotel":
      case "hotels":
        return "Hôtel";

      case "restaurant":
      case "restaurants":
        return "Restaurant";

      case "spa":
        return "Spa";

      case "circuit":
      case "circuits":
        return "Circuit";

      case "agency":
      case "agencies":
        return "Agence";

      case "destination":
      case "destinations":
        return "Destination";

      case "offer":
      case "offers":
        return "Offre";

      case "coupon":
      case "coupons":
        return "Coupon";

      default:
        return "Service";
    }
  };

  /* =====================================================
     LOAD SERVICE
  ===================================================== */

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const endpoint = map[normalizedType];

        /* ============================
           VALIDATION
        ============================ */

        if (!endpoint || !id) {
          setError(
            "Type de service ou identifiant invalide."
          );
          return;
        }

        console.log(
          "🔎 Type :",
          normalizedType
        );

        console.log(
          "🔎 Endpoint :",
          endpoint
        );

        console.log(
          "🔎 ID :",
          id
        );

        /* ============================
           API REQUEST
        ============================ */

        const response = await api.get(
          `${endpoint}/${id}`
        );

        console.log(
          "📥 RÉPONSE API :",
          response.data
        );

        let data: Item = response.data;

        /* ============================
           NORMALISATION API
        ============================ */

        if (response.data?.hotel) {
          data = response.data.hotel;

        } else if (response.data?.restaurant) {
          data = response.data.restaurant;

        } else if (response.data?.spa) {
          data = response.data.spa;

        } else if (response.data?.circuit) {
          data = response.data.circuit;

        } else if (response.data?.agency) {
          data = response.data.agency;

        } else if (response.data?.destination) {
          data = response.data.destination;

        } else if (response.data?.offer) {
          data = response.data.offer;

        } else if (response.data?.coupon) {
          data = response.data.coupon;

        } else if (response.data?.data) {
          data = response.data.data;
        }

        console.log(
          "📦 SERVICE FINAL :",
          data
        );

        setService(data);

      } catch (err: any) {
        console.error(
          "❌ ERREUR SERVICE :",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
            "Impossible de récupérer le service."
        );

      } finally {
        setLoading(false);
      }
    };

    if (normalizedType && id) {
      fetchService();
    }
  }, [normalizedType, id]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="reserve-page">

        <div className="reserve-card loading-card">

          <div className="loading-spinner"></div>

          <p>
            Chargement...
          </p>

        </div>

      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !service) {
    return (
      <div className="reserve-page">

        <div className="reserve-card error-card">

          <p className="error-message">
            {error || "Élément introuvable."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="back-button"
          >
            ← Retour
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     IMAGE
  ===================================================== */

  const image =
    service.images?.find(
      (img) =>
        typeof img === "string" &&
        img.trim() !== ""
    ) ||
    service.image ||
    service.imageUrl ||
    service.photo ||
    service.cover ||
    FALLBACK;

  /* =====================================================
     TITLE
  ===================================================== */

  const destinationObject =
    typeof service.destination === "object"
      ? service.destination
      : undefined;

  const title =
    service.name ||
    service.title ||
    destinationObject?.name ||
    service.agency?.name ||
    "Service";

  /* =====================================================
     LOCATION
     
     IMPORTANT :
     Cette variable n'est plus affichée
     sous le titre afin d'éviter la répétition.
  ===================================================== */

  const destinationName =
    typeof service.destination === "string"
      ? service.destination
      : destinationObject?.name || "";

  /* =====================================================
     DESCRIPTION
  ===================================================== */

  const description =
    service.description ||
    destinationObject?.description ||
    service.summary ||
    service.programs?.join(" • ") ||
    "Description prochainement disponible.";

  /* =====================================================
     CONTACT
  ===================================================== */

  const servicesWithContact = [
    "hotel",
    "hotels",
    "restaurant",
    "restaurants",
    "spa",
    "circuit",
    "circuits",
    "agency",
    "agencies",
  ];

  const showContact =
    servicesWithContact.includes(
      normalizedType
    );

  const phone =
    service.phone ||
    service.agency?.phone ||
    "";

  const email =
    service.email ||
    service.agency?.email ||
    "";

  const address =
    service.address ||
    service.agency?.address ||
    "";

  const website =
    service.website ||
    service.agency?.website ||
    "";

  const websiteUrl = website
    ? website.startsWith("http")
      ? website
      : `https://${website}`
    : "";

  const openingHours =
    service.openingHours ||
    service.agency?.openingHours ||
    "";

  /* =====================================================
     WHATSAPP
  ===================================================== */

  const whatsappNumber = phone.replace(
    /\D/g,
    ""
  );

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : "";

  /* =====================================================
     ARRAYS
  ===================================================== */

  const services = service.services ?? [];

  const includes = service.includes ?? [];

  const activities = service.activities ?? [];

  /* =====================================================
     RESERVATION
  ===================================================== */

  const reservableTypes = [
    "hotel",
    "hotels",

    "restaurant",
    "restaurants",

    "spa",

    "circuit",
    "circuits",

    "agency",
    "agencies",

    "offer",
    "offers",
  ];

  const canReserve =
    reservableTypes.includes(
      normalizedType
    );

  const goToAvailability = () => {
    navigate(
      `/availability/${normalizedType}/${id}`
    );
  };

  /* =====================================================
     COUPON
  ===================================================== */

  const couponCode =
    service.code ||
    service.coupon ||
    "";

  const couponExpireDate =
    service.expireDate ||
    service.expiryDate ||
    "";

  const couponId =
    service._id;

  /* =====================================================
     COPY + USE COUPON
  ===================================================== */

  const copyCoupon = async () => {

    if (!couponCode) {
      alert(
        "Aucun code promo disponible."
      );
      return;
    }

    if (!couponId) {
      console.error(
        "❌ ID du coupon manquant"
      );

      alert(
        "Impossible d'enregistrer l'utilisation du coupon."
      );

      return;
    }

    try {

      /* ============================
         1. COPIER LE CODE
      ============================ */

      await navigator.clipboard.writeText(
        couponCode
      );

      console.log(
        "📋 Code copié :",
        couponCode
      );

      /* ============================
         2. ENREGISTRER L'UTILISATION
      ============================ */

      const response = await api.post(
        `/coupons/${couponId}/use`
      );

      console.log(
        "📊 Utilisation enregistrée :",
        response.data
      );

      /* ============================
         3. MESSAGE
      ============================ */

      alert(
        "Le code promo a été copié !"
      );

    } catch (copyError: any) {

      console.error(
        "❌ Erreur copie/utilisation coupon :",
        copyError.response?.data ||
          copyError.message
      );

      alert(
        copyError.response?.data?.message ||
          "Le code a peut-être été copié, mais son utilisation n'a pas pu être enregistrée."
      );
    }
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="reserve-page">

      <div className="reserve-card">

        {/* =================================================
            IMAGE
        ================================================= */}

        <div className="reserve-image-container">

          <img
            className="reserve-image"
            src={image}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = FALLBACK;
            }}
          />

          <div className="image-overlay">

            <span className="service-badge">
              🏷️ {getServiceType()}
            </span>

          </div>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="reserve-content">

          {/* =================================================
              TITLE
          ================================================= */}

          <h1 className="reserve-title">
            {title}
          </h1>

          {/* =================================================
              DESCRIPTION
              
              IMPORTANT :
              La localisation n'est plus affichée ici.
              Elle sera affichée uniquement dans Contact.
          ================================================= */}

          <div className="description-box">

            <h2>
              📌 Présentation
            </h2>

            <p>
              {description}
            </p>

          </div>

          {/* =================================================
              HOTEL
          ================================================= */}

          {(normalizedType === "hotel" ||
            normalizedType === "hotels") && (

            <div className="service-details">

              {service.stars !== undefined &&
                service.stars > 0 && (

                <div className="info-item">

                  ⭐

                  <strong>
                    Étoiles :
                  </strong>{" "}

                  {"⭐".repeat(service.stars)}

                </div>
              )}

              {service.price !== undefined && (

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
                  ❄️ Climatisation
                </div>
              )}

            </div>
          )}

          {/* =================================================
              RESTAURANT
          ================================================= */}

          {(normalizedType === "restaurant" ||
            normalizedType === "restaurants") && (

            <div className="service-details">

              {service.cuisine && (
                <div className="info-item">

                  🍽️

                  <strong>
                    Cuisine :
                  </strong>{" "}

                  {service.cuisine}

                </div>
              )}

              {service.priceRange &&
                service.priceRange !== "0" && (

                <div className="info-item">

                  💰

                  <strong>
                    Fourchette :
                  </strong>{" "}

                  {service.priceRange}

                </div>
              )}

              {service.rating !== undefined &&
                Number(service.rating) > 0 && (

                <div className="info-item">

                  ⭐

                  <strong>
                    Note :
                  </strong>{" "}

                  {service.rating}/5

                </div>
              )}

            </div>
          )}

          {/* =================================================
              SPA
          ================================================= */}

          {normalizedType === "spa" && (

            <div className="service-details">

              {service.duration && (
                <div className="info-item">

                  ⏱️

                  <strong>
                    Durée :
                  </strong>{" "}

                  {service.duration}

                </div>
              )}

              {services.length > 0 && (
                <div className="info-item">

                  💆

                  <strong>
                    Prestations :
                  </strong>{" "}

                  {services.join(" • ")}

                </div>
              )}

              {service.price !== undefined && (
                <div className="reserve-price">

                  💰 {service.price} TND

                </div>
              )}

            </div>
          )}

          {/* =================================================
              CIRCUIT
          ================================================= */}

          {(normalizedType === "circuit" ||
            normalizedType === "circuits") && (

            <div className="service-details">

              <div className="info-item">

                🌍

                <strong>
                  Agence :
                </strong>{" "}

                {service.agency?.name ||
                  "Agence touristique"}

              </div>

              {service.price !== undefined && (
                <div className="reserve-price">

                  💰 {service.price} TND

                </div>
              )}

              {destinationName && (
                <div className="info-item">

                  📍

                  <strong>
                    Destination :
                  </strong>{" "}

                  {destinationName}

                </div>
              )}

              {activities.length > 0 && (
                <div className="info-item">

                  🎯

                  <strong>
                    Activités :
                  </strong>{" "}

                  {activities.join(" • ")}

                </div>
              )}

              {includes.length > 0 && (
                <div className="info-item">

                  ✔️

                  <strong>
                    Inclus :
                  </strong>{" "}

                  {includes.join(" • ")}

                </div>
              )}

            </div>
          )}

          {/* =================================================
              AGENCY
          ================================================= */}

          {(normalizedType === "agency" ||
            normalizedType === "agencies") && (

            <div className="service-details">

              {service.license && (
                <div className="info-item">

                  ✔️

                  <strong>
                    Licence :
                  </strong>{" "}

                  {service.license}

                </div>
              )}

              {service.yearsExperience !==
                undefined &&
                service.yearsExperience > 0 && (

                <div className="info-item">

                  📅

                  <strong>
                    Expérience :
                  </strong>{" "}

                  {service.yearsExperience} ans

                </div>
              )}

              {service.rating !== undefined &&
                Number(service.rating) > 0 && (

                <div className="info-item">

                  ⭐

                  <strong>
                    Note :
                  </strong>{" "}

                  {service.rating}/5

                </div>
              )}

            </div>
          )}

          {/* =================================================
              DESTINATION
          ================================================= */}

          {(normalizedType === "destination" ||
            normalizedType === "destinations") && (

            <div className="service-details destination-section">

              {service.country && (
                <div className="info-item">

                  🌍

                  <strong>
                    Pays :
                  </strong>{" "}

                  {service.country}

                </div>
              )}

              {service.city && (
                <div className="info-item">

                  📍

                  <strong>
                    Ville :
                  </strong>{" "}

                  {service.city}

                </div>
              )}

              {service.bestSeason && (
                <div className="info-item">

                  ☀️

                  <strong>
                    Meilleure saison :
                  </strong>{" "}

                  {service.bestSeason}

                </div>
              )}

              {activities.length > 0 && (
                <div className="info-item">

                  🎯

                  <strong>
                    Activités :
                  </strong>{" "}

                  {activities.join(" • ")}

                </div>
              )}

            </div>
          )}

          {/* =================================================
              DESTINATION CTA
          ================================================= */}

          {(normalizedType === "destination" ||
            normalizedType === "destinations") && (

            <div className="reserve-action">

              <h2>
                🌍 Découvrez cette destination
              </h2>

              <p>
                Consultez les circuits,
                hôtels, restaurants et autres
                services disponibles pour cette
                destination.
              </p>

              <button
                type="button"
                className="availability-btn"
                onClick={() => navigate("/")}
              >
                ← Retour aux voyages
              </button>

            </div>
          )}

          {/* =================================================
              OFFER
          ================================================= */}

          {(normalizedType === "offer" ||
            normalizedType === "offers") && (

            <div className="service-details offer-section">

              {service.discount !== undefined && (
                <div className="info-item">

                  🎁

                  <strong>
                    Réduction :
                  </strong>{" "}

                  {service.discount}%

                </div>
              )}

              {service.duration && (
                <div className="info-item">

                  🗓️

                  <strong>
                    Durée :
                  </strong>{" "}

                  {service.duration}

                </div>
              )}

              {service.price !== undefined && (
                <div className="reserve-price">

                  💰 {service.price} TND

                </div>
              )}

              {service.validUntil && (
                <div className="info-item">

                  📅

                  <strong>
                    Valable jusqu'au :
                  </strong>{" "}

                  {service.validUntil}

                </div>
              )}

              {includes.length > 0 && (
                <div className="info-item">

                  ✔️

                  <strong>
                    Inclus :
                  </strong>

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

            </div>
          )}

          {/* =================================================
              OFFER CTA
          ================================================= */}

          {(normalizedType === "offer" ||
            normalizedType === "offers") && (

            <div className="reserve-action">

              <h2>
                🎁 Profitez de cette offre
              </h2>

              <p>
                Consultez la disponibilité
                puis envoyez votre demande de
                réservation à l'administrateur.
              </p>

              <button
                type="button"
                className="availability-btn"
                onClick={goToAvailability}
              >
                🔎 Vérifier la disponibilité
              </button>

            </div>
          )}

          {/* =================================================
              COUPON
          ================================================= */}

          {(normalizedType === "coupon" ||
            normalizedType === "coupons") && (

            <div className="service-details coupon-section">

              <div className="info-item">

                🎫

                <strong>
                  Code promo
                </strong>

              </div>

              {couponCode ? (

                <div className="coupon-code">

                  <h2>
                    {couponCode}
                  </h2>

                </div>

              ) : (

                <div className="info-item">

                  Aucun code promo disponible.

                </div>

              )}

              {service.discount !== undefined && (
                <div className="info-item">

                  💸

                  <strong>
                    Réduction :
                  </strong>{" "}

                  {service.discount}%

                </div>
              )}

              {couponExpireDate && (
                <div className="info-item">

                  📅

                  <strong>
                    Expire le :
                  </strong>{" "}

                  {new Date(
                    couponExpireDate
                  ).toLocaleDateString("fr-FR")}

                </div>
              )}

              {service.active !== undefined && (
                <div className="info-item">

                  {service.active
                    ? "🟢 Coupon actif"
                    : "🔴 Coupon inactif"}

                </div>
              )}

              {couponCode && (

                <button
                  type="button"
                  className="availability-btn"
                  onClick={copyCoupon}
                >
                  📋 Copier le code
                </button>

              )}

            </div>
          )}

          {/* =================================================
              COUPON CTA
          ================================================= */}

          {(normalizedType === "coupon" ||
            normalizedType === "coupons") && (

            <div className="reserve-action">

              <h2>
                🎫 Utilisez votre code promo
              </h2>

              <p>
                Copiez le code ci-dessus et
                utilisez-le lors de votre
                réservation.
              </p>

            </div>
          )}

          {/* =================================================
              CONTACT
              
              IMPORTANT :
              Adresse + ville + pays + horaires
              sont affichés ici uniquement.
          ================================================= */}

          {showContact && (

            <div className="contact-box">

              <h2>
                💬 Contact
              </h2>

              {/* ================================
                  WHATSAPP
              ================================= */}

              {whatsappUrl && (

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link whatsapp-link"
                >
                  💬 Contacter sur WhatsApp
                </a>

              )}

              {/* ================================
                  EMAIL
              ================================= */}

              {email && (

                <a
                  href={`mailto:${email}`}
                  className="contact-link"
                >
                  ✉️ {email}
                </a>

              )}

              {/* ================================
                  WEBSITE
              ================================= */}

              {websiteUrl && (

                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  🌐 Visiter le site web
                </a>

              )}

              {/* ================================
                  ADRESSE + VILLE + PAYS
              ================================= */}

              {(address ||
                service.city ||
                service.country) && (

                <div className="contact-link">

                  📍{" "}

                  {address}

                  {address &&
                    service.city &&
                    ", "}

                  {service.city}

                  {service.city &&
                    service.country &&
                    ", "}

                  {service.country}

                </div>

              )}

              {/* ================================
                  HORAIRES
              ================================= */}

              {openingHours && (

                <div className="contact-link">

                  🕒 {openingHours}

                </div>

              )}

            </div>

          )}

          {/* =================================================
              CONTACT INFORMATION
          ================================================= */}

          {showContact && (

            <div className="contact-information">

              <p>

                💡 Vous pouvez contacter
                directement l'établissement
                avant d'envoyer votre demande
                de réservation.

              </p>

            </div>

          )}

          {/* =================================================
              RESERVATION CTA
          ================================================= */}

          {canReserve &&
            normalizedType !== "offer" &&
            normalizedType !== "offers" && (

            <div className="reserve-action">

              <h2>
                📝 Vous souhaitez réserver ?
              </h2>

              <p>
                Consultez la disponibilité
                puis envoyez votre demande
                de réservation à
                l'administrateur.
              </p>

              <button
                type="button"
                className="availability-btn"
                onClick={goToAvailability}
              >
                🔎 Vérifier la disponibilité
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}