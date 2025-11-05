// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const storedRole = localStorage.getItem("role"); // "admin" or "staff"

  if (!storedRole) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && storedRole !== role) {
    // Logged in but wrong role
    return <Navigate to="/" replace />;
  }

  return children;
}
