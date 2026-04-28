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

  // ✅ ambil dari localStorage
  const localToken = localStorage.getItem("token");

  if (!token && localToken) {
    return (
      <div className="text-center mt-10">
        Loading...
      </div>
    );
  }

  // ❌ kalau benar-benar belum login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ role tidak sesuai
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}