import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TravelPage.css";

/* ==================================================
   TYPES
================================================== */

type Item = {
  _id: string;

  name?: string;
  title?: string;
  description?: string;

  price?: number;

  image?: string;
  images?: string[];
  imageUrl?: string;
  logo?: string;
  photo?: string;
  cover?: string;

  city?: string;
  country?: string;
};

type ServiceType =
  | "hotel"
  | "agency"
  | "circuit"
  | "restaurant"
  | "spa"
  | "destination"
  | "offer"
  | "coupon";

/* ==================================================
   API
================================================== */

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

/* ==================================================
   TOKEN INTERCEPTOR
================================================== */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


/* ==================================================
   GESTION TOKEN EXPIRÉ / INVALIDE
================================================== */

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    // Token invalide ou expiré
    if (error.response?.status === 401) {

      console.warn(
        "🔐 Token invalide ou expiré"
      );

      // Supprimer les anciennes informations
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirection login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


export default function TravelPage() {
  const navigate = useNavigate();

  /* ==================================================
     STATES
  ================================================== */

  const [hotels, setHotels] = useState<Item[]>([]);
  const [agency, setAgency] = useState<Item[]>([]);
  const [circuits, setCircuits] = useState<Item[]>([]);
  const [restaurants, setRestaurants] = useState<Item[]>([]);
  const [spa, setSpa] = useState<Item[]>([]);
  const [destinations, setDestinations] = useState<Item[]>([]);
  const [offers, setOffers] = useState<Item[]>([]);
  const [coupons, setCoupons] = useState<Item[]>([]);

  const [search, setSearch] = useState("");

  const [adults, setAdults] = useState<number>(1);

  const [children, setChildren] = useState<number>(0);

  const [departureDate, setDepartureDate] = useState("");

  /* ==================================================
     LOGOUT
  ================================================== */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  /* ==================================================
     GET ARRAY
  ================================================== */

  const getArray = (response: any): Item[] => {
    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.data)) {
      return response.data.data;
    }

    if (Array.isArray(response?.data?.hotels)) {
      return response.data.hotels;
    }

    if (Array.isArray(response?.data?.agency)) {
      return response.data.agency;
    }

    if (Array.isArray(response?.data?.agencies)) {
      return response.data.agencies;
    }

    if (Array.isArray(response?.data?.circuits)) {
      return response.data.circuits;
    }

    if (Array.isArray(response?.data?.restaurants)) {
      return response.data.restaurants;
    }

    if (Array.isArray(response?.data?.spas)) {
      return response.data.spas;
    }

    if (Array.isArray(response?.data?.destinations)) {
      return response.data.destinations;
    }

    if (Array.isArray(response?.data?.offers)) {
      return response.data.offers;
    }

    if (Array.isArray(response?.data?.coupons)) {
      return response.data.coupons;
    }

    return [];
  };

  /* ==================================================
     LOAD DATA
  ================================================== */

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          hotelsRes,
          agencyRes,
          circuitsRes,
          restaurantsRes,
          spaRes,
          destinationsRes,
          offersRes,
          couponsRes,
        ] = await Promise.all([
          api.get("/hotels"),
          api.get("/agency"),
          api.get("/circuits"),
          api.get("/restaurants"),
          api.get("/spa"),
          api.get("/destinations"),
          api.get("/offers"),
          api.get("/coupons"),
        ]);

        const hotelsData = getArray(hotelsRes);
        const agencyData = getArray(agencyRes);
        const circuitsData = getArray(circuitsRes);
        const restaurantsData = getArray(restaurantsRes);
        const spaData = getArray(spaRes);
        const destinationsData = getArray(destinationsRes);
        const offersData = getArray(offersRes);
        const couponsData = getArray(couponsRes);

        setHotels(hotelsData);
        setAgency(agencyData);
        setCircuits(circuitsData);
        setRestaurants(restaurantsData);
        setSpa(spaData);
        setDestinations(destinationsData);
        setOffers(offersData);
        setCoupons(couponsData);

        console.log("🏨 HOTELS :", hotelsData);
        console.log("✈ AGENCY :", agencyData);
        console.log("🌍 CIRCUITS :", circuitsData);
        console.log("🍽 RESTAURANTS :", restaurantsData);
        console.log("🧖 SPA :", spaData);
        console.log("📍 DESTINATIONS :", destinationsData);
        console.log("🎯 OFFERS :", offersData);
        console.log("🎟 COUPONS :", couponsData);
      } catch (error: any) {
        console.error(
          "❌ Erreur récupération données :",
          error.response?.data || error.message
        );
      }
    };

    loadData();
  }, []);

  /* ==================================================
     STRIPE PAYMENT
  ================================================== */

  const handlePayment = async (
  item: Item,
  type: ServiceType
) => {
  try {

    const token =
      localStorage.getItem("token");

    // Aucun token
    if (!token) {

      alert(
        "Votre session a expiré. Veuillez vous reconnecter."
      );

      navigate("/login");

      return;
    }

    let serviceType: string;

    switch (type) {

      case "hotel":
        serviceType = "Hotel";
        break;

      case "agency":
        serviceType = "Agency";
        break;

      case "circuit":
        serviceType = "Circuit";
        break;

      default:

        alert(
          "Le paiement est disponible uniquement pour les hôtels, agences et circuits."
        );

        return;
    }

    /* ============================================
       1. CRÉER BOOKING
    ============================================ */

    const bookingResponse =
      await api.post(
        "/bookings",
        {
          serviceId: item._id,

          serviceType,

          persons:
            Number(adults) +
            Number(children),

          checkIn:
            departureDate || undefined,
        }
      );

    const booking =
      bookingResponse.data?.booking ||
      bookingResponse.data?.data;

    const bookingId =
      booking?._id;

    if (!bookingId) {

      alert(
        "La réservation n'a pas pu être créée."
      );

      return;
    }

    console.log(
      "✅ Booking ID :",
      bookingId
    );

    /* ============================================
       2. STRIPE CHECKOUT
    ============================================ */

    const paymentResponse =
      await api.post(
        "/payments/create-checkout-session",
        {
          bookingId,

          customerEmail:
            "john.smith@example.com",
        }
      );

    /* ============================================
       3. REDIRECTION STRIPE
    ============================================ */

    if (
      paymentResponse.data?.success &&
      paymentResponse.data?.url
    ) {

      window.location.href =
        paymentResponse.data.url;

      return;
    }

    alert(
      "URL Stripe introuvable."
    );

  } catch (error: any) {

    console.error(
      "❌ Erreur paiement :",
      error.response?.data ||
      error.message
    );

    /* ============================================
       TOKEN INVALIDE
    ============================================ */

    if (
      error.response?.status === 401
    ) {

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert(
        "Votre session a expiré. Veuillez vous reconnecter."
      );

      navigate("/login");

      return;
    }

    /* ============================================
       AUTRE ERREUR
    ============================================ */

    alert(
      error.response?.data?.message ||
      "Erreur lors de la création du paiement."
    );
  }
};

  /* ==================================================
     SEARCH / FILTER
  ================================================== */

  const filterData = (
    items: Item[]
  ): Item[] => {
    if (!Array.isArray(items)) {
      return [];
    }

    if (search.trim() === "") {
      return items;
    }

    const searchText =
      search.toLowerCase().trim();

    return items.filter((item) => {
      const text = `
        ${item.name || ""}
        ${item.title || ""}
        ${item.city || ""}
        ${item.country || ""}
        ${item.description || ""}
      `.toLowerCase();

      return text.includes(searchText);
    });
  };

  /* ==================================================
     IMAGE
  ================================================== */

  const getImage = (item: Item) => {
    return (
      item.images?.[0] ||
      item.image ||
      item.imageUrl ||
      item.logo ||
      item.photo ||
      item.cover ||
      "https://res.cloudinary.com/dgdemj83g/image/upload/v1782930952/european-best-destinations-2023-tossa-de-mar_p6sq4y.jpg"
    );
  };

  /* ==================================================
     CARD
  ================================================== */

  const Card = ({
    item,
    type,
  }: {
    item: Item;
    type: ServiceType;
  }) => {
    const itemName =
      item.name ||
      item.title ||
      "Service";

    return (
      <div className="travel-card">

        {/* IMAGE */}

        <img
          className="travel-image"
          src={getImage(item)}
          alt={itemName}
          onError={(e) => {
            e.currentTarget.src =
              "https://res.cloudinary.com/dgdemj83g/image/upload/v1784476115/il_570xN.1736956593_bmtu_sgked6.jpg";
          }}
        />

        {/* BODY */}

        <div className="travel-card-body">

          <h3>
            {itemName}
          </h3>

          {/* LOCATION */}

          {(item.city || item.country) && (
            <p>
              📍{" "}
              {item.city || ""}
              {" "}
              {item.country || ""}
            </p>
          )}

          {/* DESCRIPTION */}

          {item.description && (
            <p className="travel-description">
              {item.description}
            </p>
          )}

          {/* PRICE */}

          <p className="travel-price">
            {item.price &&
            item.price > 0
              ? `💰 ${item.price} TND`
              : "Prix sur demande"}
          </p>

          {/* BUTTONS */}

          <div className="travel-buttons">

            {/* RESERVE */}

            <button
              className="reserve-btn"
              onClick={() =>
                navigate(
                  `/reserve/${type}/${item._id}`
                )
              }
            >
              Réserver
            </button>

            {/* PAY */}

            {(type === "hotel" ||
              type === "agency" ||
              type === "circuit") && (
              <button
                className="pay-btn"
                onClick={() =>
                  handlePayment(
                    item,
                    type
                  )
                }
              >
                💳 Payer
              </button>
            )}

          </div>
        </div>
      </div>
    );
  };

  /* ==================================================
     SECTION
  ================================================== */

  const Section = ({
    title,
    data,
    type,
  }: {
    title: string;
    data: Item[];
    type: ServiceType;
  }) => {
    const items = filterData(data);

    if (items.length === 0) {
      return null;
    }

    return (
      <section className="travel-section">

        <h2>
          {title}
        </h2>

        <div className="travel-grid">

          {items.map((item) => (
            <Card
              key={item._id}
              item={item}
              type={type}
            />
          ))}

        </div>

      </section>
    );
  };

  /* ==================================================
     RETURN
  ================================================== */

  return (
    <div className="travel-page">

      {/* ==============================================
          HEADER
      ============================================== */}

      <header className="travel-header">

        <h1>
          🌍 Travel App
        </h1>

        <div className="header-buttons">

          <button
            className="chat-btn"
            onClick={() =>
              navigate("/chat")
            }
          >
            💬 Chat
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </header>

      {/* ==============================================
          SEARCH
      ============================================== */}

      <div className="search-box">

        <input
          type="text"
          placeholder="Rechercher destination..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <input
          type="number"
          min="1"
          placeholder="Nombre d'adultes"
          value={adults}
          onChange={(e) =>
            setAdults(
              Number(e.target.value)
            )
          }
        />

        <input
          type="number"
          min="0"
          placeholder="Nombre d'enfants"
          value={children}
          onChange={(e) =>
            setChildren(
              Number(e.target.value)
            )
          }
        />

        <input
          type="date"
          value={departureDate}
          onChange={(e) =>
            setDepartureDate(
              e.target.value
            )
          }
        />

      </div>

      {/* ==============================================
          HOTELS
      ============================================== */}

      <Section
        title="🏨 Hôtels"
        data={hotels}
        type="hotel"
      />

      {/* ==============================================
          AGENCIES
      ============================================== */}

      <Section
        title="✈ Agences"
        data={agency}
        type="agency"
      />

      {/* ==============================================
          CIRCUITS
      ============================================== */}

      <Section
        title="🌍 Circuits"
        data={circuits}
        type="circuit"
      />

      {/* ==============================================
          RESTAURANTS
      ============================================== */}

      <Section
        title="🍽 Restaurants"
        data={restaurants}
        type="restaurant"
      />

      {/* ==============================================
          SPA
      ============================================== */}

      <Section
        title="🧖 Spa"
        data={spa}
        type="spa"
      />

      {/* ==============================================
          DESTINATIONS
      ============================================== */}

      <Section
        title="📍 Destinations"
        data={destinations}
        type="destination"
      />

      {/* ==============================================
          OFFERS
      ============================================== */}

      <Section
        title="🎯 Offres"
        data={offers}
        type="offer"
      />

      {/* ==============================================
          COUPONS
      ============================================== */}

      <Section
        title="🎟 Coupons"
        data={coupons}
        type="coupon"
      />

    </div>
  );
}