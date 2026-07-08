import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed flex flex-col">

      {/* TITLE */}
      <h1 className="text-xl font-bold mb-6">
        🏨 Admin Panel
      </h1>

      {/* MENU */}
      <nav className="flex flex-col gap-2 text-sm">

        <Link to="/" className="hover:bg-gray-800 p-2 rounded">Dashboard</Link>
        <Link to="/bookings" className="hover:bg-gray-800 p-2 rounded">Bookings</Link>
        <Link to="/rooms" className="hover:bg-gray-800 p-2 rounded">Rooms</Link>
        <Link to="/spa" className="hover:bg-gray-800 p-2 rounded">Spa</Link>
        <Link to="/restaurants" className="hover:bg-gray-800 p-2 rounded">Restaurants</Link>
        <Link to="/circuits" className="hover:bg-gray-800 p-2 rounded">Circuits</Link>
        <Link to="/offers" className="hover:bg-gray-800 p-2 rounded">Offers</Link>
        <Link to="/calendar" className="hover:bg-gray-800 p-2 rounded">Calendar</Link>

      </nav>

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="mt-auto bg-red-600 hover:bg-red-700 p-2 rounded"
      >
        Logout
      </button>

    </div>
  );
};

export default Sidebar;