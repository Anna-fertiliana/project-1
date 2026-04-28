import { Link, Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  const location = useLocation();

  const activeClass = (path: string) =>
    location.pathname.startsWith(path)
      ? "bg-blue-600 text-white"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            to="/admin/borrowed"
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeClass(
              "/admin/borrowed"
            )}`}
          >
            Borrowed List
          </Link>

          <Link
            to="/admin/users"
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeClass(
              "/admin/users"
            )}`}
          >
            Users
          </Link>

          <Link
            to="/admin/books"
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeClass(
              "/admin/books"
            )}`}
          >
            Book List
          </Link>
        </div>

        {/* Page content */}
        <Outlet />
      </div>
    </div>
  );
}