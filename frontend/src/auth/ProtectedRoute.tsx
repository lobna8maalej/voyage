import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
  role?: "admin" | "user";
};

const ProtectedRoute = ({ children, role }: Props) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Pas connecté
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Vérification du rôle
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;