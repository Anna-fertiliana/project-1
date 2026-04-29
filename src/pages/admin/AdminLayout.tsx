import { Link, Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  const location = useLocation();

  const activeClass = (path: string) =>
    location.pathname.startsWith(path)
      ? "bg-blue-600 text-white"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* 🔝 TOP NAVBAR */}
      <AdminNavbar />

      {/* 🔽 CONTENT */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* 🔥 MOBILE-FIRST TABS (SCROLLABLE) */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            
            <Link
              to="/admin/borrowed"
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${activeClass(
                "/admin/borrowed"
              )}`}
            >
              Borrowed
            </Link>

            <Link
              to="/admin/users"
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${activeClass(
                "/admin/users"
              )}`}
            >
              Users
            </Link>

            <Link
              to="/admin/books"
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${activeClass(
                "/admin/books"
              )}`}
            >
              Books
            </Link>

          </div>
        </div>

        {/* 📄 PAGE CONTENT */}
        <Outlet />
      </div>
    </div>
  );
}