
import { useEffect, useState } from "react";
import api from "./axios";
import DashboardNavbar from "./DashboardNavbar";
import "./Dashboard.css";

// =====================================================
// TYPE BOOKING
// =====================================================

type Booking = {
  _id: string;

  user?: {
    _id?: string;
    name?: string;
    email?: string;
  };

  userName?: string;
  name?: string;
  email?: string;

  service?: any;
  serviceName?: string;
  type?: string;

  persons?: number;

  date?: string;
  bookingDate?: string;
  checkIn?: string;

  status?: string;

  totalPrice?: number;
  price?: number;

  createdAt?: string;
};

// =====================================================
// TYPE ADMIN STATISTICS
// =====================================================

type AdminStatistics = {
  users: number;
  bookings: number;
  payments: number;
  services: number;
  coupons: number;
  hotels: number;
  reviews: number;
};

// =====================================================
// DASHBOARD
// =====================================================

const Dashboard = () => {

  // =====================================================
  // STATES BOOKINGS
  // =====================================================

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // STATES STATISTICS
  // =====================================================

  const [statistics, setStatistics] =
    useState<AdminStatistics>({
      users: 0,
      bookings: 0,
      payments: 0,
      services: 0,
      coupons: 0,
      hotels: 0,
      reviews: 0,
    });


  // =====================================================
  // CHARGEMENT INITIAL
  // =====================================================

  useEffect(() => {

    fetchBookings();
    fetchStatistics();
    fetchServices();
    fetchHotels();

  }, []);


  // =====================================================
  // GET BOOKINGS
  // =====================================================

  const fetchBookings = async () => {

    try {

      setLoading(true);
      setError("");

      console.log(
        "📥 Récupération des réservations..."
      );

      const response =
        await api.get("/bookings");

      console.log(
        "📦 BOOKINGS API :",
        response.data
      );

      const data =
        response.data?.data ||
        response.data?.bookings ||
        response.data ||
        [];

      setBookings(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err: any) {

      console.error(
        "❌ BOOKING ERROR :",
        err.response?.data ||
        err.message
      );

      setError(
        err.response?.data?.message ||
        "Impossible de récupérer les réservations."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // GET STATISTICS
  // =====================================================

  const fetchStatistics = async () => {

    try {

      console.log(
        "📊 Récupération des statistiques..."
      );

      const response =
        await api.get(
          "/admin/statistics"
        );

      console.log(
        "📊 STATISTICS API :",
        response.data
      );

      const data =
        response.data?.data ||
        response.data ||
        {};

      setStatistics((prev) => ({

        ...prev,

        users:
          data.users || 0,

        bookings:
          data.bookings || 0,

        payments:
          data.payments || 0,

        reviews:
          data.reviews || 0,

      }));

    } catch (err: any) {

      console.error(
        "❌ STATISTICS ERROR :",
        err.response?.data ||
        err.message
      );

    }
  };


  // =====================================================
  // GET SERVICES
  // =====================================================

  const fetchServices = async () => {

    try {

      console.log(
        "🏨 Récupération des services..."
      );

      const response =
        await api.get("/services");

      console.log(
        "📦 SERVICES API :",
        response.data
      );

      // =================================================
      // ADAPTATION DES RÉPONSES API
      // =================================================

      const services =
        Array.isArray(response.data)
          ? response.data
          : response.data?.data ||
            response.data?.services ||
            [];

      const serviceList =
        Array.isArray(services)
          ? services
          : [];


      // =================================================
      // COUPONS
      // =================================================

      const coupons =
        serviceList.filter(
          (service: any) =>
            service?.type
              ?.toLowerCase()
              ?.trim() === "coupon"
        );


      // =================================================
      // SERVICES NORMAUX
      // On exclut uniquement les coupons.
      //
      // Les hôtels ne sont plus recherchés ici.
      // Ils sont récupérés avec /hotels.
      // =================================================

      const normalServices =
        serviceList.filter(
          (service: any) =>
            service?.type
              ?.toLowerCase()
              ?.trim() !== "coupon"
        );


      // =================================================
      // LOGS
      // =================================================

      console.log(
        "🏨 Services :",
        normalServices
      );

      console.log(
        "🏨 Nombre de services :",
        normalServices.length
      );

      console.log(
        "🎫 Coupons :",
        coupons
      );

      console.log(
        "🎫 Nombre de coupons :",
        coupons.length
      );


      // =================================================
      // MISE À JOUR STATISTIQUES
      // =================================================

      setStatistics((prev) => ({

        ...prev,

        services:
          normalServices.length,

        coupons:
          coupons.length,

      }));

    } catch (error: any) {

      console.error(
        "❌ Erreur récupération services :",
        error.response?.data ||
        error.message
      );

    }
  };


  // =====================================================
  // GET HOTELS
  // =====================================================

  const fetchHotels = async () => {

    try {

      console.log(
        "🏨 Récupération des hôtels..."
      );

      const response =
        await api.get("/hotels");

      console.log(
        "📦 HOTELS API :",
        response.data
      );


      // =================================================
      // ADAPTATION DES RÉPONSES API
      // =================================================

      const hotels =
        Array.isArray(response.data)
          ? response.data
          : response.data?.data ||
            response.data?.hotels ||
            [];


      const hotelList =
        Array.isArray(hotels)
          ? hotels
          : [];


      // =================================================
      // LOGS
      // =================================================

      console.log(
        "🏨 Hôtels :",
        hotelList
      );

      console.log(
        "🏨 Nombre d'hôtels :",
        hotelList.length
      );


      // =================================================
      // MISE À JOUR STATISTIQUE HÔTELS
      // =================================================

      setStatistics((prev) => ({

        ...prev,

        hotels:
          hotelList.length,

      }));

    } catch (error: any) {

      console.error(
        "❌ Erreur récupération hôtels :",
        error.response?.data ||
        error.message
      );

    }
  };


  // =====================================================
  // ACTUALISER TOUT LE DASHBOARD
  // =====================================================

  const refreshDashboard = () => {

    fetchBookings();
    fetchStatistics();
    fetchServices();
    fetchHotels();

  };


  // =====================================================
  // NOM CLIENT
  // =====================================================

  const getClientName = (
    booking: Booking
  ) => {

    return (
      booking.user?.name ||
      booking.userName ||
      booking.name ||
      "Client"
    );

  };


  // =====================================================
  // SERVICE
  // =====================================================

  const getServiceName = (
    booking: Booking
  ) => {

    if (booking.serviceName) {

      return booking.serviceName;

    }

    if (
      typeof booking.service === "string"
    ) {

      return booking.service;

    }

    if (
      booking.service &&
      typeof booking.service === "object"
    ) {

      return (
        booking.service.name ||
        booking.service.title ||
        booking.service.type ||
        "Service"
      );

    }

    return (
      booking.type ||
      "Service"
    );

  };


  // =====================================================
  // TYPE SERVICE
  // =====================================================

  const getServiceType = (
    booking: Booking
  ) => {

    if (booking.type) {

      return booking.type;

    }

    if (
      booking.service &&
      typeof booking.service === "object"
    ) {

      return (
        booking.service.type ||
        ""
      );

    }

    return "";

  };


  // =====================================================
  // DATE
  // =====================================================

  const getBookingDate = (
    booking: Booking
  ) => {

    const date =
      booking.date ||
      booking.bookingDate ||
      booking.checkIn ||
      booking.createdAt;

    if (!date) {

      return "-";

    }

    try {

      return new Date(
        date
      ).toLocaleDateString(
        "fr-FR"
      );

    } catch {

      return "-";

    }

  };


  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (
    booking: Booking
  ) => {

    return (
      booking.status ||
      "Nouvelle"
    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <>

        <DashboardNavbar />

        <div
          className="dashboard"
          style={{
            padding: 30,
          }}
        >

          <h2>
            📊 Dashboard
          </h2>

          <p>
            Chargement du dashboard...
          </p>

        </div>

      </>
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <>

        <DashboardNavbar />

        <div
          className="dashboard"
          style={{
            padding: 30,
          }}
        >

          <h2>
            📊 Dashboard
          </h2>

          <p
            style={{
              color: "red",
            }}
          >
            ❌ {error}
          </p>

          <button
            onClick={refreshDashboard}
          >
            🔄 Réessayer
          </button>

        </div>

      </>
    );

  }


  // =====================================================
  // DASHBOARD
  // =====================================================

  return (

    <>

      <DashboardNavbar />

      <div
        className="dashboard"
        style={{
          padding: 30,
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 25,
          }}
        >

          <div>

            <h1>
              📊 Dashboard
            </h1>

            <p>
              Vue générale de votre plateforme
            </p>

          </div>

          <button
            onClick={
              refreshDashboard
            }
          >
            🔄 Actualiser
          </button>

        </div>


        {/* =================================================
            STATISTIQUES
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 20,
            marginBottom: 35,
          }}
        >


          {/* UTILISATEURS */}

          <div
            className="stat-card"
            style={{
              padding: 20,
              border:
                "1px solid #ddd",
              borderRadius: 10,
            }}
          >

            <span>
              👥
            </span>

            <strong
              style={{
                display: "block",
                fontSize: 28,
                marginTop: 10,
              }}
            >
              {statistics.users}
            </strong>

            <p>
              Utilisateurs
            </p>

          </div>


          {/* RÉSERVATIONS */}

          <div
            className="stat-card"
            style={{
              padding: 20,
              border:
                "1px solid #ddd",
              borderRadius: 10,
            }}
          >

            <span>
              📋
            </span>

            <strong
              style={{
                display: "block",
                fontSize: 28,
                marginTop: 10,
              }}
            >
              {statistics.bookings}
            </strong>

            <p>
              Réservations
            </p>

          </div>


          {/* PAIEMENTS */}

          <div
            className="stat-card"
            style={{
              padding: 20,
              border:
                "1px solid #ddd",
              borderRadius: 10,
            }}
          >

            <span>
              💳
            </span>

            <strong
              style={{
                display: "block",
                fontSize: 28,
                marginTop: 10,
              }}
            >
              {statistics.payments}
            </strong>

            <p>
              Paiements
            </p>

          </div>


          {/* SERVICES */}

          <div
            className="stat-card"
            style={{
              padding: 20,
              border:
                "1px solid #ddd",
              borderRadius: 10,
            }}
          >

            <span>
              🛎️
            </span>

            <strong
              style={{
                display: "block",
                fontSize: 28,
                marginTop: 10,
              }}
            >
              {statistics.services}
            </strong>

            <p>
              Services
            </p>

          </div>


          {/* COUPONS */}

          <div
            className="stat-card"
            style={{
              padding: 20,
              border:
                "1px solid #ddd",
              borderRadius: 10,
            }}
          >

            <span>
              🎫
            </span>

            <strong
              style={{
                display: "block",
                fontSize: 28,
                marginTop: 10,
              }}
            >
              {statistics.coupons}
            </strong>

            <p>
              Coupons
            </p>

          </div>


          {/* HÔTELS */}

          <div
            className="stat-card"
            style={{
              padding: 20,
              border:
                "1px solid #ddd",
              borderRadius: 10,
            }}
          >

            <span>
              🏨
            </span>

            <strong
              style={{
                display: "block",
                fontSize: 28,
                marginTop: 10,
              }}
            >
              {statistics.hotels}
            </strong>

            <p>
              Hôtels
            </p>

          </div>


          {/* AVIS */}

          <div
            className="stat-card"
            style={{
              padding: 20,
              border:
                "1px solid #ddd",
              borderRadius: 10,
            }}
          >

            <span>
              ⭐
            </span>

            <strong
              style={{
                display: "block",
                fontSize: 28,
                marginTop: 10,
              }}
            >
              {statistics.reviews}
            </strong>

            <p>
              Avis
            </p>

          </div>

        </div>


        {/* =================================================
            RÉSERVATIONS
        ================================================= */}

        <div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >

            <div>

              <h2>
                📋 Réservations
              </h2>

              <p>
                Gestion des réservations
                des clients
              </p>

            </div>

          </div>


          {/* =================================================
              AUCUNE RÉSERVATION
          ================================================= */}

          {bookings.length === 0 ? (

            <div
              style={{
                padding: 30,
                textAlign: "center",
                border:
                  "1px solid #ddd",
                borderRadius: 10,
              }}
            >

              <h3>
                📭 Aucune réservation
              </h3>

              <p>
                Les réservations des
                utilisateurs apparaîtront
                ici.
              </p>

            </div>

          ) : (

            <div
              style={{
                overflowX: "auto",
              }}
            >

              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse",
                }}
              >

                <thead>

                  <tr>

                    <th
                      style={{
                        padding: 15,
                        textAlign:
                          "left",
                        borderBottom:
                          "2px solid #ddd",
                      }}
                    >
                      Client
                    </th>

                    <th
                      style={{
                        padding: 15,
                        textAlign:
                          "left",
                        borderBottom:
                          "2px solid #ddd",
                      }}
                    >
                      Service
                    </th>

                    <th
                      style={{
                        padding: 15,
                        textAlign:
                          "left",
                        borderBottom:
                          "2px solid #ddd",
                      }}
                    >
                      Type
                    </th>

                    <th
                      style={{
                        padding: 15,
                        textAlign:
                          "left",
                        borderBottom:
                          "2px solid #ddd",
                      }}
                    >
                      Date
                    </th>

                    <th
                      style={{
                        padding: 15,
                        textAlign:
                          "left",
                        borderBottom:
                          "2px solid #ddd",
                      }}
                    >
                      Personnes
                    </th>

                    <th
                      style={{
                        padding: 15,
                        textAlign:
                          "left",
                        borderBottom:
                          "2px solid #ddd",
                      }}
                    >
                      Statut
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {bookings.map(
                    (booking) => (

                      <tr
                        key={
                          booking._id
                        }
                      >

                        {/* CLIENT */}

                        <td
                          style={{
                            padding: 15,
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >

                          <strong>
                            {
                              getClientName(
                                booking
                              )
                            }
                          </strong>

                          {(booking.user
                            ?.email ||
                            booking.email) && (

                            <div>

                              {
                                booking.user
                                  ?.email ||
                                booking.email
                              }

                            </div>

                          )}

                        </td>


                        {/* SERVICE */}

                        <td
                          style={{
                            padding: 15,
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >

                          {
                            getServiceName(
                              booking
                            )
                          }

                        </td>


                        {/* TYPE */}

                        <td
                          style={{
                            padding: 15,
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >

                          {
                            getServiceType(
                              booking
                            ) || "-"
                          }

                        </td>


                        {/* DATE */}

                        <td
                          style={{
                            padding: 15,
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >

                          {
                            getBookingDate(
                              booking
                            )
                          }

                        </td>


                        {/* PERSONNES */}

                        <td
                          style={{
                            padding: 15,
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >

                          {
                            booking.persons ||
                            1
                          }

                        </td>


                        {/* STATUT */}

                        <td
                          style={{
                            padding: 15,
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >

                          <span
                            style={{
                              padding:
                                "6px 12px",
                              borderRadius:
                                20,
                              background:
                                "#f1f1f1",
                            }}
                          >

                            {
                              getStatus(
                                booking
                              )
                            }

                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </>

  );
};

export default Dashboard;


