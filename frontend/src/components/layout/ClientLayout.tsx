import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function ClientLayout() {
  return (
    <div>
      <Navbar />

      <div style={{ padding: 20 }}>
        <Outlet />
      </div>
    </div>
  );
}