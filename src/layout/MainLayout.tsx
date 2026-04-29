import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdminNavbar from "../pages/admin/AdminNavbar";
import { useAppSelector } from "../app/hooks";

const MainLayout = () => {
  const location = useLocation();

  const { user, viewMode } = useAppSelector(
    (state) => state.auth
  );

  const isAdminRoute =
    location.pathname.startsWith("/admin");

  const isAdminUser =
    user?.role === "ADMIN";

  const showAdminNavbar =
    isAdminUser &&
    (isAdminRoute || viewMode === "ADMIN");

  const showUserNavbar =
    !isAdminRoute &&
    (!isAdminUser || viewMode === "USER");

  const showFooter =
    !isAdminRoute &&
    (!isAdminUser || viewMode === "USER");

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-50">
      {/* Navbar */}
      {showAdminNavbar && <AdminNavbar />}
      {showUserNavbar && <Navbar />}

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;