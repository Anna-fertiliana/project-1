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
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      {showAdminNavbar && <AdminNavbar />}
      {showUserNavbar && <Navbar />}

      {/* PAGE CONTENT */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;