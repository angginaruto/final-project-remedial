import { Navigate, Outlet } from "react-router-dom";

type Role = "ADMIN" | "CASHIER";

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") as Role | null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}