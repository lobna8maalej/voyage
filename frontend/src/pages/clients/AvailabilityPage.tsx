import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../admin/axios";
import "./AvailabilityPage.css";

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

  name?: string;
  title?: string;

  description?: string;
  summary?: string;

  price?: number;

  image?: string;
  imageUrl?: string;
  images?: string[];
  photo?: string;
  cover?: string;

  city?: string;
  country?: string;
  location?: string;

  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  openingHours?: string;

  cuisine?: string;
  priceRange?: string;
  duration?: string;

  stars?: number;
  rating?: number;

  wifi?: boolean;
  pool?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  airConditioning?: boolean;

  activities?: string[];
  services?: string[];
  includes?: string[];

  destination?: string | Destination;

  agency?: Agency;
};

/* =====================================================
   FALLBACK
===================================================== */

const FALLBACK =
  "https://res.cloudinary.com/dgdemj83g/image/upload/v1782842430/The-Voyage-With-Water-Tower-from-Drone_javckd.webp";

/* =====================================================
   COMPONENT
===================================================== */

export default function AvailabilityPage() {
  const { type, id } = useParams();

  const navigate = useNavigate();

  /* =====================================================
     STATES
  ===================================================== */

  const [service, setService] =
    useState<Item | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("photos");

  const [currentImage, setCurrentImage] =
    useState(0);

  /* =====================================================
     API MAP
  ===================================================== */

  const map: Record<string, string> = {
    offers: "/offers",
    offer: "/offers",

    hotels: "/hotels",
    hotel: "/hotels",

    restaurants: "/restaurants",
    restaurant: "/restaurants",

    circuits: "/circuits",
    circuit: "/circuits",

    spa: "/spa",

    destinations: "/destinations",
    destination: "/destinations",

    coupons: "/coupons",
    coupon: "/coupons",

    agency: "/agency",
    agencies: "/agency",
  };

  /* =====================================================
     SERVICE TYPE
  ===================================================== */

  const getServiceType = (): string => {
    switch (type?.toLowerCase()) {
      case "hotel":
      case "hotels":
        return "Hotel";

      case "agency":
      case "agencies":
        return "Agency";

      case "circuit":
      case "circuits":
        return "Circuit";

      case "restaurant":
      case "restaurants":
        return "Restaurant";

      case "spa":
        return "Spa";

      case "destination":
      case "destinations":
        return "Destination";

      case "offer":
      case "offers":
        return "Offer";

      case "coupon":
      case "coupons":
        return "Coupon";

      default:
        return "Service";
    }
  };

  /* =====================================================
     PRESENTATION
  ===================================================== */

  const getPresentation = (): string => {
    switch (type?.toLowerCase()) {
      case "hotel":
      case "hotels":
        return "Hôtel confortable avec services premium et emplacement idéal.";

      case "restaurant":
      case "restaurants":
        return "Restaurant proposant une cuisine locale et internationale.";

      case "spa":
        return "Spa proposant différents soins relaxants, massages et services de bien-être.";

      case "circuit":
      case "circuits":
        return "Circuit touristique organisé avec différentes activités et visites.";

      case "agency":
      case "agencies":
        return "Agence spécialisée dans l'organisation de voyages et séjours.";

      case "destination":
      case "destinations":
        return "Destination touristique proposant des paysages et expériences uniques.";

      case "offer":
      case "offers":
        return "Offre touristique spécialement sélectionnée pour les voyageurs.";

      default:
        return "Service touristique avec une expérience unique.";
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

        const endpoint =
          map[type?.toLowerCase() || ""];

        if (!endpoint || !id) {
          setError(
            "Type de service ou identifiant invalide."
          );
          return;
        }

        const response =
          await api.get(
            `${endpoint}/${id}`
          );

        let data: any = response.data;

        if (response.data?.hotel) {
          data = response.data.hotel;
        } else if (response.data?.agency) {
          data = response.data.agency;
        } else if (response.data?.circuit) {
          data = response.data.circuit;
        } else if (response.data?.restaurant) {
          data = response.data.restaurant;
        } else if (response.data?.spa) {
          data = response.data.spa;
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
          "📦 SERVICE :",
          data
        );

        setService(data);
        setCurrentImage(0);

      } catch (err: any) {
        console.error(
          "❌ ERREUR SERVICE :",
          err.response?.data ||
            err.message
        );

        setError(
          err.response?.data?.message ||
            "Impossible de récupérer le service."
        );

      } finally {
        setLoading(false);
      }
    };

    if (type && id) {
      fetchService();
    }

  }, [type, id]);

  /* =====================================================
     IMAGES
  ===================================================== */

  const serviceImages: string[] =
    service
      ? [
          ...(service.images || []),
          service.image,
          service.imageUrl,
          service.photo,
          service.cover,
        ].filter(
          (img): img is string =>
            typeof img === "string" &&
            img.trim() !== ""
        )
      : [];

  /* =====================================================
     AUTO CAROUSEL
  ===================================================== */

  useEffect(() => {
    if (serviceImages.length <= 1) {
      return;
    }

    const timer =
      setTimeout(() => {
        setCurrentImage(
          (prev) =>
            prev ===
            serviceImages.length - 1
              ? 0
              : prev + 1
        );
      }, 3000);

    return () =>
      clearTimeout(timer);

  }, [
    currentImage,
    serviceImages.length,
  ]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="availability-page">

        <div className="availability-card">

          <p>
            Chargement du service...
          </p>

        </div>

      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (!service) {
    return (
      <div className="availability-page">

        <div className="availability-card">

          <p className="error-message">
            {error ||
              "Service introuvable."}
          </p>

          <button
            onClick={() =>
              navigate("/travel")
            }
          >
            ← Retour
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     VARIABLES
  ===================================================== */

  const image =
    serviceImages.length > 0
      ? serviceImages[currentImage]
      : FALLBACK;

  const title =
    service.name ||
    service.title ||
    service.agency?.name ||
    "Service";

  const destination =
    typeof service.destination ===
    "string"
      ? service.destination
      : service.destination?.name ||
        service.destination?.city ||
        service.destination?.country ||
        service.city ||
        service.country ||
        service.location ||
        "";

  const price =
    service.price;

  const openingHours =
    service.openingHours ||
    service.agency?.openingHours ||
    "";

  /* =====================================================
     RESERVATION BUTTON
  ===================================================== */

  const goToReservation = () => {
    navigate(
      `/reservation/${type}/${id}`
    );
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="availability-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="availability-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/travel")
          }
        >
          ← Retour
        </button>

        <h1>
          {title}
        </h1>

      </div>

      {/* =================================================
          CARD
      ================================================= */}

      <div className="availability-card">

        {/* =================================================
            CAROUSEL
        ================================================= */}

        <div className="carousel">

          <img
            src={image}
            alt={title}
            onError={(e) => {
              e.currentTarget.src =
                FALLBACK;
            }}
          />

          {serviceImages.length > 1 && (
            <>
              <button
                type="button"
                className="carousel-btn left"
                onClick={() =>
                  setCurrentImage(
                    currentImage === 0
                      ? serviceImages.length - 1
                      : currentImage - 1
                  )
                }
              >
                ❮
              </button>

              <button
                type="button"
                className="carousel-btn right"
                onClick={() =>
                  setCurrentImage(
                    currentImage ===
                    serviceImages.length - 1
                      ? 0
                      : currentImage + 1
                  )
                }
              >
                ❯
              </button>
            </>
          )}

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="availability-content">

          {/* TITLE */}

          <h1 className="availability-title">
            {title}
          </h1>

          {/* TYPE */}

          <p>
            🏷️ {getServiceType()}
          </p>

          {/* LOCATION */}

          {destination && (
            <p className="availability-location">
              📍 {destination}
            </p>
          )}

          {/* PRICE */}

          {price !== undefined &&
          price !== null ? (

            <div className="availability-price">
              💰 À partir de {price} TND
            </div>

          ) : (

            <p className="price-request">
              Prix sur demande
            </p>

          )}

          {/* =================================================
              RESERVATION CTA
          ================================================= */}

          <div className="reservation-cta">

            <button
              type="button"
              className="reservation-main-btn"
              onClick={
                goToReservation
              }
            >
              📝 Réserver maintenant
            </button>

            <p>
              Envoyez votre demande
              de réservation à
              l'administrateur.
            </p>

          </div>

          {/* =================================================
              TABS
          ================================================= */}

          <div className="tabs">

            <button
              type="button"
              className={
                activeTab === "photos"
                  ? "tab-btn active"
                  : "tab-btn"
              }
              onClick={() =>
                setActiveTab("photos")
              }
            >
              📸 Photos
            </button>

            <button
              type="button"
              className={
                activeTab ===
                "presentation"
                  ? "tab-btn active"
                  : "tab-btn"
              }
              onClick={() =>
                setActiveTab(
                  "presentation"
                )
              }
            >
              📌 Présentation
            </button>

            <button
              type="button"
              className={
                activeTab ===
                "equipements"
                  ? "tab-btn active"
                  : "tab-btn"
              }
              onClick={() =>
                setActiveTab(
                  "equipements"
                )
              }
            >
              🛏 Équipements
            </button>

            <button
              type="button"
              className={
                activeTab === "avis"
                  ? "tab-btn active"
                  : "tab-btn"
              }
              onClick={() =>
                setActiveTab("avis")
              }
            >
              ⭐ Avis
            </button>

          </div>

          {/* =================================================
              PHOTOS
          ================================================= */}

          {activeTab === "photos" && (

            <div className="thumbnails">

              {(
                serviceImages.length > 0
                  ? serviceImages
                  : [FALLBACK]
              ).map(
                (
                  img: string,
                  index: number
                ) => (

                  <img
                    key={index}
                    src={img}
                    alt={`Photo ${index + 1}`}
                    onClick={() =>
                      setCurrentImage(index)
                    }
                    className={
                      currentImage === index
                        ? "active"
                        : ""
                    }
                    onError={(e) => {
                      e.currentTarget.src =
                        FALLBACK;
                    }}
                  />

                )
              )}

            </div>

          )}

          {/* =================================================
              PRESENTATION
          ================================================= */}

          {activeTab ===
            "presentation" && (

            <div className="presentation">

              <h2>
                📌 Présentation
              </h2>

              <p>
                {service.description ||
                  service.summary ||
                  getPresentation()}
              </p>

            </div>

          )}

          {/* =================================================
              EQUIPEMENTS
          ================================================= */}

          {activeTab ===
            "equipements" && (

            <div className="equipements">

              <h2>
                🛏 Équipements
              </h2>

              <ul>

                {service.wifi && (
                  <li>
                    ✔ WiFi gratuit
                  </li>
                )}

                {service.airConditioning && (
                  <li>
                    ✔ Climatisation
                  </li>
                )}

                {service.pool && (
                  <li>
                    ✔ Piscine
                  </li>
                )}

                {service.parking && (
                  <li>
                    ✔ Parking
                  </li>
                )}

                {service.breakfast && (
                  <li>
                    ✔ Petit-déjeuner inclus
                  </li>
                )}

                {service.services?.map(
                  (
                    item: string,
                    index: number
                  ) => (
                    <li
                      key={`service-${index}`}
                    >
                      ✔ {item}
                    </li>
                  )
                )}

                {service.activities?.map(
                  (
                    item: string,
                    index: number
                  ) => (
                    <li
                      key={`activity-${index}`}
                    >
                      ✔ {item}
                    </li>
                  )
                )}

                {service.includes?.map(
                  (
                    item: string,
                    index: number
                  ) => (
                    <li
                      key={`include-${index}`}
                    >
                      ✔ {item}
                    </li>
                  )
                )}

                {!service.wifi &&
                  !service.airConditioning &&
                  !service.pool &&
                  !service.parking &&
                  !service.breakfast &&
                  !service.services?.length &&
                  !service.activities?.length &&
                  !service.includes?.length && (
                    <li>
                      ✔ Informations
                      disponibles auprès
                      du service.
                    </li>
                  )}

              </ul>

            </div>

          )}

          {/* =================================================
              AVIS
          ================================================= */}

          {activeTab === "avis" && (

            <div className="avis">

              <h2>
                ⭐ Avis clients
              </h2>

              <div className="review">

                <strong>
                  Amine ⭐⭐⭐⭐⭐
                </strong>

                <p>
                  Excellent service,
                  personnel accueillant
                  et très professionnel.
                </p>

              </div>

              <div className="review">

                <strong>
                  Sara ⭐⭐⭐⭐
                </strong>

                <p>
                  Très bonne expérience,
                  je recommande vivement
                  cet établissement.
                </p>

              </div>

              <div className="review">

                <strong>
                  Youssef ⭐⭐⭐⭐
                </strong>

                <p>
                  Bon rapport qualité/prix,
                  service rapide et cadre
                  agréable.
                </p>

              </div>

            </div>

          )}

          {/* =================================================
              CONTACT
          ================================================= */}

          <div className="contact-box">

            <h2>
              📞 Contact
            </h2>

            {/* TELEPHONE */}

            {service.phone && (

              <a
                href={`tel:${service.phone.replace(
                  /\s/g,
                  ""
                )}`}
                className="contact-link"
              >
                📞 {service.phone}
              </a>

            )}

            {/* EMAIL */}

            {service.email && (

              <a
                href={`mailto:${service.email}`}
                className="contact-link"
              >
                ✉️ {service.email}
              </a>

            )}

            {/* WEBSITE */}

            {service.website && (

              <a
                href={
                  service.website.startsWith(
                    "http"
                  )
                    ? service.website
                    : `https://${service.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                🌐 Visiter le site web
              </a>

            )}

            {/* ADDRESS */}

            {service.address && (

              <div className="contact-link">
                📍 {service.address}
              </div>

            )}

            {/* OPENING HOURS */}

            {openingHours && (

              <div className="contact-link">
                🕒 {openingHours}
              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}