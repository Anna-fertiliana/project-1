import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  const activeClass = (path: string) =>
    location.pathname.includes(path)
      ? "bg-gray-200"
      : "bg-gray-100";

  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <Link
          to="/admin/borrowed"
          className={`px-6 py-2 rounded-full ${activeClass("borrowed")}`}
        >
          Borrowed List
        </Link>

        <Link
          to="/admin/users"
          className={`px-6 py-2 rounded-full ${activeClass("users")}`}
        >
          User
        </Link>

        <Link
          to="/admin/books"
          className={`px-6 py-2 rounded-full ${activeClass("books")}`}
        >
          Book List
        </Link>
      </div>

      {/* Content */}
      <Outlet />
    </div>
  );
}