import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./components/layout/Layout";
import ClientLayout from "./components/layout/ClientLayout";
import ProtectedRoute from "./auth/ProtectedRoute";

// =====================================================
// AUTH
// =====================================================

import Auth from "./pages/admin/Auth";

// =====================================================
// ADMIN
// =====================================================

import Dashboard from "./pages/admin/Dashboard";
import AdminBookings from "./pages/admin/Admin Bookings";
import DashboardPayments from "./pages/admin/DashboardPayments";
import Revenue from "./pages/admin/Revenue";
import DashboardContacts from "./pages/admin/DashboardContacts";
import DashboardQR from "./pages/admin/DashboardQR";

import Rooms from "./pages/admin/Rooms";
import RoomDetails from "./pages/admin/RoomDetails";
import CalendarPage from "./pages/admin/Calendar";
import CheckIn from "./pages/admin/CheckIn";
import Featured from "./pages/admin/FeaturedServices";
import Coupons from "./pages/admin/Coupons";
import Reviews from "./pages/admin/Reviews";
import ServicesByType from "./pages/admin/ServicesByType";
import CreateService from "./pages/admin/CreateService";
import ServiceDetails from "./pages/admin/ServiceDetails";

// =====================================================
// CLIENT
// =====================================================

import TravelPage from "./pages/clients/TravelPage";
import ReservePage from "./pages/clients/ReservePage";
import MyBookings from "./pages/clients/MyBookings";
import DetailsPage from "./pages/clients/DetailsPage";
import AvailabilityPage from "./pages/clients/AvailabilityPage";
import ChatPage from "./pages/clients/chatPage";

// =====================================================
// RÉSERVATION
// =====================================================

import ReservationPage from "./pages/Reservation/ReservationPage";

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================================
            ESPACE PUBLIC CLIENT
        ===================================================== */}

        <Route element={<ClientLayout />}>

          {/* =================================================
              ACCUEIL
          ================================================= */}

          <Route
            path="/"
            element={<TravelPage />}
          />

          {/* =================================================
              CHAT CLIENT
          ================================================= */}

          <Route
            path="/chat"
            element={<ChatPage />}
          />

          {/* =================================================
              DISPONIBILITÉ
          ================================================= */}

          <Route
            path="/availability/:type/:id"
            element={<AvailabilityPage />}
          />

          {/* =================================================
              RESERVE
          ================================================= */}

          <Route
            path="/reserve/:type/:id"
            element={<ReservePage />}
          />

          {/* =================================================
              FORMULAIRE RÉSERVATION
          ================================================= */}

          <Route
            path="/reservation/:type/:id"
            element={<ReservationPage />}
          />

          {/* =================================================
              DETAILS
          ================================================= */}

          <Route
            path="/details/:type/:id"
            element={<DetailsPage />}
          />

        </Route>


        {/* =====================================================
            AUTHENTIFICATION
        ===================================================== */}

        <Route
          path="/login"
          element={<Auth />}
        />

        <Route
          path="/register"
          element={<Auth />}
        />


        {/* =====================================================
            ESPACE CLIENT CONNECTÉ
        ===================================================== */}

        <Route
          element={
            <ProtectedRoute role="user">
              <ClientLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/my-bookings"
            element={<MyBookings />}
          />

        </Route>


        {/* =====================================================
            DASHBOARD ADMIN
            http://localhost:5173/admin
        ===================================================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            DASHBOARD
            http://localhost:5173/dashboard
        ===================================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            ADMIN BOOKINGS
            http://localhost:5173/bookings
        ===================================================== */}

        <Route
          path="/bookings"
          element={
            <ProtectedRoute role="admin">
              <AdminBookings />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            ADMIN CONTACTS
            http://localhost:5173/contacts
        ===================================================== */}

        <Route
          path="/contacts"
          element={
            <ProtectedRoute role="admin">
              <DashboardContacts />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            ADMIN PAYMENTS
            http://localhost:5173/payments
        ===================================================== */}

        <Route
          path="/payments"
          element={
            <ProtectedRoute role="admin">
              <DashboardPayments />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            REVENUE ADMIN
            http://localhost:5173/revenue
        ===================================================== */}

        <Route
          path="/revenue"
          element={
            <ProtectedRoute role="admin">
              <Revenue />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            QR CODES ADMIN
            http://localhost:5173/qr
        ===================================================== */}

        <Route
          path="/qr"
          element={
            <ProtectedRoute role="admin">
              <DashboardQR />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            AUTRES PAGES ADMIN
            AVEC LAYOUT
        ===================================================== */}

        <Route
          element={
            <ProtectedRoute role="admin">
              <Layout />
            </ProtectedRoute>
          }
        >

          {/* =================================================
              ROOMS
          ================================================= */}

          <Route
            path="/rooms"
            element={<Rooms />}
          />

          <Route
            path="/room/:id"
            element={<RoomDetails />}
          />


          {/* =================================================
              CALENDAR
          ================================================= */}

          <Route
            path="/calendar"
            element={<CalendarPage />}
          />


          {/* =================================================
              CHECK-IN
          ================================================= */}

          <Route
            path="/checkin"
            element={<CheckIn />}
          />


          {/* =================================================
              SERVICES
          ================================================= */}

          <Route
            path="/featured"
            element={<Featured />}
          />

          <Route
            path="/coupons"
            element={<Coupons />}
          />

          <Route
            path="/reviews"
            element={<Reviews />}
          />

          <Route
            path="/services/type/:type"
            element={<ServicesByType />}
          />

          <Route
            path="/services/create"
            element={<CreateService />}
          />

          <Route
            path="/services/:id"
            element={<ServiceDetails />}
          />


          {/* =================================================
              CHAT ADMIN
          ================================================= */}

          <Route
            path="/admin/chat"
            element={<ChatPage />}
          />

        </Route>


        {/* =====================================================
            404
        ===================================================== */}

        <Route
          path="*"
          element={
            <div
              style={{
                padding: "40px",
                textAlign: "center",
              }}
            >

              <h1>
                404
              </h1>

              <p>
                Page introuvable.
              </p>

            </div>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;


