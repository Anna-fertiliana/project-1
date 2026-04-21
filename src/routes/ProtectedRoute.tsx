import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "USER" | "ADMIN";
}

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const { token, user } = useAppSelector(
    (state) => state.auth
  );

  // User belum login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role tidak sesuai
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}