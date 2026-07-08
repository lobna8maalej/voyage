import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏨 Admin Panel</h1>

        <button
          onClick={handleLogout}
          className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2 text-sm">

        <Link to="/" className="hover:bg-gray-800 px-3 py-2 rounded">
          Dashboard
        </Link>

        <Link to="/bookings" className="hover:bg-gray-800 px-3 py-2 rounded">
          Bookings
        </Link>

        <Link to="/rooms" className="hover:bg-gray-800 px-3 py-2 rounded">
          Rooms
        </Link>

        <Link to="/spa" className="hover:bg-gray-800 px-3 py-2 rounded">
          Spa
        </Link>

        <Link to="/restaurants" className="hover:bg-gray-800 px-3 py-2 rounded">
          Restaurants
        </Link>

        <Link to="/circuits" className="hover:bg-gray-800 px-3 py-2 rounded">
          Circuits
        </Link>

        <Link to="/offers" className="hover:bg-gray-800 px-3 py-2 rounded">
          Offers
        </Link>

        <Link to="/featured" className="hover:bg-gray-800 px-3 py-2 rounded">
          Featured
        </Link>

        <Link to="/calendar" className="hover:bg-gray-800 px-3 py-2 rounded">
          Calendar
        </Link>

        <Link to="/coupons" className="hover:bg-gray-800 px-3 py-2 rounded">
          Coupons
        </Link>

        <Link to="/reviews" className="hover:bg-gray-800 px-3 py-2 rounded">
          Reviews
        </Link>

      </nav>
    </div>
  );
};

export default Sidebar;