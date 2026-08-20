import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import "./DashboardNavbar.css";


export default function DashboardNavbar() {

  const location = useLocation();

  const navigate = useNavigate();


  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");

  };


  return (

    <nav className="dashboard-navbar">

      <div className="dashboard-navbar-left">


        {/* =================================================
            DASHBOARD
        ================================================= */}

        <Link
          to="/admin"
          className={
            location.pathname === "/admin" ||
            location.pathname === "/dashboard"
              ? "dashboard-nav-link active"
              : "dashboard-nav-link"
          }
        >
          📊 Dashboard
        </Link>


        {/* =================================================
            RÉSERVATIONS
        ================================================= */}

        <Link
          to="/bookings"
          className={
            location.pathname === "/bookings"
              ? "dashboard-nav-link active"
              : "dashboard-nav-link"
          }
        >
          📋 Réservations
        </Link>


        {/* =================================================
            CONTACTS
        ================================================= */}

        <Link
          to="/contacts"
          className={
            location.pathname === "/contacts"
              ? "dashboard-nav-link active"
              : "dashboard-nav-link"
          }
        >
          📩 Contacts
        </Link>


        {/* =================================================
            PAYMENTS
        ================================================= */}

        <Link
          to="/payments"
          className={
            location.pathname === "/payments"
              ? "dashboard-nav-link active"
              : "dashboard-nav-link"
          }
        >
          💳 Payments
        </Link>


        {/* =================================================
            REVENUE
        ================================================= */}

        <Link
          to="/revenue"
          className={
            location.pathname === "/revenue"
              ? "dashboard-nav-link active"
              : "dashboard-nav-link"
          }
        >
          💰 Revenue
        </Link>


        {/* =================================================
            QR CODES
        ================================================= */}

        <Link
          to="/qr"
          className={
            location.pathname === "/qr"
              ? "dashboard-nav-link active"
              : "dashboard-nav-link"
          }
        >
          📱 QR Codes
        </Link>


      </div>

    </nav>

  );
}
