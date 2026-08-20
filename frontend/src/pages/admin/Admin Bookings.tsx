import { useEffect, useState } from "react";
import axios from "axios";
import "./Admin Bookings.css";

// =====================================================
// TYPE USER
// =====================================================

type BookingUser = {
  _id?: string;
  name?: string;
  email?: string;
};

// =====================================================
// TYPE SERVICE
// =====================================================

type BookingService = {
  _id?: string;
  name?: string;
  title?: string;
  type?: string;
  serviceType?: string;
};

// =====================================================
// TYPE BOOKING
// =====================================================

type Booking = {
  _id: string;

  user?: BookingUser;

  userName?: string;
  name?: string;
  email?: string;

  service?: BookingService;

  serviceName?: string;

  serviceType?: string;
  type?: string;

  persons?: number;

  date?: string;
  bookingDate?: string;

  checkIn?: string;
  checkOut?: string;

  totalPrice?: number;
  price?: number;

  paymentStatus?: string;

  status?: string;

  // Admin a vu la réservation
  adminViewed?: boolean;

  createdAt?: string;
};

// =====================================================
// TYPE ERREUR AXIOS
// =====================================================

type ApiError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
      success?: boolean;
    };
  };
  message?: string;
};

// =====================================================
// COMPONENT
// =====================================================

export default function DashboardBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = (): string | null => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken")
    );
  };

  // =====================================================
  // RÉCUPÉRER LES BOOKINGS
  // GET /api/bookings
  // =====================================================

  const fetchBookings = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      console.log("🔐 TOKEN :", token);

      if (!token) {
        setError(
          "Token manquant. Veuillez vous connecter en tant qu'administrateur."
        );

        return;
      }

      console.log("📥 GET /api/bookings");

      const response = await axios.get(
        "http://localhost:5000/api/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "📋 BOOKINGS API :",
        response.data
      );

      // =================================================
      // LE BACKEND PEUT RETOURNER :
      //
      // [...]
      //
      // OU
      //
      // { success: true, data: [...] }
      //
      // OU
      //
      // { success: true, bookings: [...] }
      // =================================================

      const data: Booking[] =
        Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.bookings)
          ? response.data.bookings
          : [];

      console.log(
        "📋 BOOKINGS FINALES :",
        data
      );

      setBookings(data);
    } catch (err: unknown) {
      const error = err as ApiError;

      console.error(
        "❌ Erreur récupération bookings :",
        error.response?.data ||
          error.message
      );

      // =================================================
      // 401
      // =================================================

      if (error.response?.status === 401) {
        setError(
          "Accès refusé : token absent ou expiré. Veuillez vous reconnecter."
        );

        return;
      }

      // =================================================
      // 403
      // =================================================

      if (error.response?.status === 403) {
        setError(
          "Accès refusé : vous devez être administrateur."
        );

        return;
      }

      // =================================================
      // AUTRE ERREUR
      // =================================================

      setError(
        error.response?.data?.message ||
          error.message ||
          "Impossible de récupérer les réservations."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // MARQUER UNE RÉSERVATION COMME VUE
  //
  // PUT /api/bookings/:id/viewed
  // =====================================================

  const markBookingAsViewed = async (
    bookingId: string
  ): Promise<void> => {
    try {
      const token = getToken();

      if (!token) {
        console.error(
          "❌ Token absent"
        );

        return;
      }

      console.log(
        "👁️ PUT réservation vue :",
        bookingId
      );

      const response = await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/viewed`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "✅ PUT /viewed :",
        response.data
      );

      // =================================================
      // MODIFIER DIRECTEMENT LE BOOKING
      // SANS RECHARGER LA PAGE
      // =================================================

      setBookings(
        (prevBookings) =>
          prevBookings.map(
            (booking) =>
              booking._id === bookingId
                ? {
                    ...booking,
                    adminViewed: true,
                  }
                : booking
          )
      );
    } catch (err: unknown) {
      const error = err as ApiError;

      console.error(
        "❌ Erreur PUT /viewed :",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Impossible de marquer la réservation comme vue."
      );
    }
  };

  // =====================================================
  // CHARGEMENT INITIAL
  // =====================================================

  useEffect(() => {
    fetchBookings();
  }, []);

  // =====================================================
  // STATISTIQUES
  // =====================================================

  const totalBookings =
    bookings.length;

  const newBookingsCount =
    bookings.filter(
      (booking) =>
        !booking.adminViewed
    ).length;

  const viewedBookingsCount =
    bookings.filter(
      (booking) =>
        booking.adminViewed
    ).length;

  const confirmedBookings =
    bookings.filter(
      (booking) => {
        const status =
          booking.status
            ?.toString()
            .toLowerCase()
            .trim();

        return (
          status === "confirmed" ||
          status === "confirmée" ||
          status === "confirmee"
        );
      }
    ).length;

  const cancelledBookings =
    bookings.filter(
      (booking) => {
        const status =
          booking.status
            ?.toString()
            .toLowerCase()
            .trim();

        return (
          status === "cancelled" ||
          status === "canceled" ||
          status === "annulée" ||
          status === "annulee"
        );
      }
    ).length;

  // =====================================================
  // FONCTION TYPE SERVICE
  // =====================================================

  const getServiceType = (
    booking: Booking
  ): string => {
    const type = (
      booking.serviceType ||
      booking.type ||
      booking.service?.serviceType ||
      booking.service?.type ||
      ""
    )
      .toString()
      .toLowerCase()
      .trim();

    switch (type) {
      case "hotel":
      case "hotels":
        return "🏨 Hôtel";

      case "circuit":
      case "circuits":
        return "🌍 Circuit";

      case "spa":
        return "💆 Spa";

      case "restaurant":
      case "restaurants":
        return "🍽️ Restaurant";

      case "agency":
      case "agencies":
        return "🏢 Agence";

      case "offer":
      case "offers":
        return "🎁 Offre";

      case "destination":
      case "destinations":
        return "📍 Destination";

      case "coupon":
      case "coupons":
        return "🎟️ Coupon";

      default:
        return "🛎️ Service";
    }
  };

  // =====================================================
  // NOM DU CLIENT
  // =====================================================

  const getClientName = (
    booking: Booking
  ): string => {
    return (
      booking.user?.name ||
      booking.userName ||
      booking.name ||
      booking.user?.email ||
      "Client"
    );
  };

  // =====================================================
  // EMAIL CLIENT
  // =====================================================

  const getClientEmail = (
    booking: Booking
  ): string => {
    return (
      booking.user?.email ||
      booking.email ||
      "-"
    );
  };

  // =====================================================
  // NOM SERVICE
  // =====================================================

  const getServiceName = (
    booking: Booking
  ): string => {
    return (
      booking.service?.name ||
      booking.service?.title ||
      booking.serviceName ||
      "Service"
    );
  };

  // =====================================================
  // PRIX
  // =====================================================

  const getTotalPrice = (
    booking: Booking
  ): number | null => {
    if (
      booking.totalPrice !==
      undefined
    ) {
      return booking.totalPrice;
    }

    if (
      booking.price !==
      undefined
    ) {
      return booking.price;
    }

    return null;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date?: string
  ): string => {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "fr-FR"
    );
  };

  // =====================================================
  // FORMAT DATE + HEURE
  // =====================================================

  const formatDateTime = (
    date?: string
  ): string => {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleString(
      "fr-FR"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="dashboard-bookings">
        <h2>
          📋 Réservations
        </h2>

        <p>
          Chargement des
          réservations...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="dashboard-bookings">

        <h2>
          📋 Réservations
        </h2>

        <div className="booking-error">
          ❌ {error}
        </div>

        <button
          type="button"
          className="btn-refresh"
          onClick={fetchBookings}
        >
          🔄 Réessayer
        </button>

      </div>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="dashboard-bookings">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bookings-header">

        <div>
          <h2>
            📋 Réservations
          </h2>

          <p>
            Gestion des réservations
            des clients
          </p>
        </div>

        <button
          type="button"
          className="btn-refresh"
          onClick={fetchBookings}
        >
          🔄 Actualiser
        </button>

      </div>

      {/* =================================================
          STATISTIQUES
      ================================================= */}

      <div className="booking-stats">

        {/* TOTAL */}

        <div className="booking-stat-card">
          <span>📋</span>

          <strong>
            {totalBookings}
          </strong>

          <p>
            Total
          </p>
        </div>

        {/* NON VUES */}

        <div
          className={`booking-stat-card ${
            newBookingsCount > 0
              ? "stat-new"
              : ""
          }`}
        >
          <span>🔔</span>

          <strong>
            {newBookingsCount}
          </strong>

          <p>
            Non vues
          </p>
        </div>

        {/* VUES */}

        <div className="booking-stat-card">
          <span>👁️</span>

          <strong>
            {viewedBookingsCount}
          </strong>

          <p>
            Vues
          </p>
        </div>

        {/* CONFIRMÉES */}

        <div className="booking-stat-card">
          <span>✅</span>

          <strong>
            {confirmedBookings}
          </strong>

          <p>
            Confirmées
          </p>
        </div>

        {/* ANNULÉES */}

        <div className="booking-stat-card">
          <span>❌</span>

          <strong>
            {cancelledBookings}
          </strong>

          <p>
            Annulées
          </p>
        </div>

      </div>

      {/* =================================================
          AUCUN BOOKING
      ================================================= */}

      {bookings.length === 0 ? (

        <div className="no-bookings">

          <div className="empty-icon">
            📭
          </div>

          <h3>
            Aucune réservation
          </h3>

          <p>
            Les nouvelles réservations
            apparaîtront ici.
          </p>

        </div>

      ) : (

        /* =================================================
           LISTE DES BOOKINGS
        ================================================= */

        <div className="bookings-list">

          {bookings.map(
            (booking) => {

              const totalPrice =
                getTotalPrice(
                  booking
                );

              return (
                <div
                  key={
                    booking._id
                  }
                  className={`booking-card ${
                    booking.adminViewed
                      ? "booking-viewed"
                      : "booking-new"
                  }`}
                >

                  {/* ========================================
                      HEADER BOOKING
                  ======================================== */}

                  <div className="booking-card-header">

                    <div>

                      <h3>
                        {getServiceName(
                          booking
                        )}
                      </h3>

                      <span className="booking-type">
                        {getServiceType(
                          booking
                        )}
                      </span>

                    </div>

                    <div>

                      {booking.adminViewed ? (

                        <span className="viewed">
                          👁️ Vue
                        </span>

                      ) : (

                        <span className="not-viewed">
                          🔔 Nouvelle
                        </span>

                      )}

                    </div>

                  </div>

                  {/* ========================================
                      CLIENT
                  ======================================== */}

                  <div className="booking-info">

                    <p>
                      👤{" "}
                      <strong>
                        Client :
                      </strong>{" "}
                      {getClientName(
                        booking
                      )}
                    </p>

                    <p>
                      📧{" "}
                      <strong>
                        Email :
                      </strong>{" "}
                      {getClientEmail(
                        booking
                      )}
                    </p>

                  </div>

                  {/* ========================================
                      INFORMATIONS
                  ======================================== */}

                  <div className="booking-details">

                    <div>

                      <span>
                        👥
                      </span>

                      <strong>
                        Personnes
                      </strong>

                      <p>
                        {booking.persons ||
                          1}
                      </p>

                    </div>

                    <div>

                      <span>
                        💰
                      </span>

                      <strong>
                        Total
                      </strong>

                      <p>
                        {totalPrice !==
                        null
                          ? `${totalPrice} TND`
                          : "-"}
                      </p>

                    </div>

                    <div>

                      <span>
                        💳
                      </span>

                      <strong>
                        Paiement
                      </strong>

                      <p>
                        {booking.paymentStatus ||
                          "-"}
                      </p>

                    </div>

                    <div>

                      <span>
                        📌
                      </span>

                      <strong>
                        Statut
                      </strong>

                      <p>
                        {booking.status ||
                          "Nouvelle"}
                      </p>

                    </div>

                  </div>

                  {/* ========================================
                      DATES
                  ======================================== */}

                  <div className="booking-dates">

                    {booking.checkIn && (
                      <p>
                        📅{" "}
                        <strong>
                          Check-in :
                        </strong>{" "}
                        {formatDate(
                          booking.checkIn
                        )}
                      </p>
                    )}

                    {booking.checkOut && (
                      <p>
                        📅{" "}
                        <strong>
                          Check-out :
                        </strong>{" "}
                        {formatDate(
                          booking.checkOut
                        )}
                      </p>
                    )}

                    {booking.date && (
                      <p>
                        📅{" "}
                        <strong>
                          Date :
                        </strong>{" "}
                        {formatDate(
                          booking.date
                        )}
                      </p>
                    )}

                    {booking.bookingDate && (
                      <p>
                        📅{" "}
                        <strong>
                          Date réservation :
                        </strong>{" "}
                        {formatDate(
                          booking.bookingDate
                        )}
                      </p>
                    )}

                  </div>

                  {/* ========================================
                      DATE CRÉATION
                  ======================================== */}

                  <div className="booking-created">

                    🕒{" "}
                    <strong>
                      Réservation créée :
                    </strong>{" "}

                    {formatDateTime(
                      booking.createdAt
                    )}

                  </div>

                  {/* ========================================
                      BOUTON VIEW
                  ======================================== */}

                  {!booking.adminViewed && (

                    <button
                      type="button"
                      className="btn-view-booking"
                      onClick={() =>
                        markBookingAsViewed(
                          booking._id
                        )
                      }
                    >
                      👁️ Marquer comme vue
                    </button>

                  )}

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}
