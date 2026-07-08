import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ClientLayout from "./components/layout/ClientLayout";
import ProtectedRoute from "./auth/ProtectedRoute";

// AUTH
import Auth from "./pages/admin/Auth";

// ADMIN
import Dashboard from "./pages/admin/Dashboard";
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

// CLIENT
import TravelPage from "./pages/clients/TravelPage";
import ReservePage from "./pages/clients/ReservePage";
import MyBookings from "./pages/clients/MyBookings";
import DetailsPage from "./pages/clients/DetailsPage";
import AvailabilityPage from "./pages/clients/AvailabilityPage";
import ChatPage from "./pages/clients/chatPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC CLIENT ================= */}
       <Route element={<ClientLayout />}>
  <Route path="/" element={<TravelPage />} />

  <Route 
    path="/chat" 
    element={<ChatPage />} 
  />

  <Route 
    path="/reserve/:type/:id" 
    element={<ReservePage />} 
  />

  <Route path="/details/:type/:id" element={<DetailsPage />} />
  <Route path="/availability/:type/:id" element={<AvailabilityPage />} />

</Route>

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* ================= USER ================= */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute role="user">
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyBookings />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          element={
            <ProtectedRoute role="admin">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/rooms" element={<Rooms />} />
          <Route path="/room/:id" element={<RoomDetails />} />

          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/checkin" element={<CheckIn />} />

          <Route path="/featured" element={<Featured />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/reviews" element={<Reviews />} />

          <Route path="/services/type/:type" element={<ServicesByType />} />
          <Route path="/services/create" element={<CreateService />} />
          <Route path="/services/:id" element={<ServiceDetails />} />

          <Route path="/bookings" element={<MyBookings />} />
        <Route path="/chat" element={<ChatPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;