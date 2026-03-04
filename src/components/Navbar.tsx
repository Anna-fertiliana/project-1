import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from "../features/authSlice";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  /* ================= CART QUERY ================= */
  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/cart");
      return res.data;
    },
    enabled: !!token,
  });

  const cartCount = Array.isArray(data?.data)
    ? data.data.length
    : 0;

  /* ================= DROPDOWN STATE ================= */
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="border-b px-8 py-4 flex justify-between items-center bg-white">
      {/* ================= LOGO ================= */}
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
        <span className="font-semibold text-lg">Booky</span>
      </Link>

      {/* ================= RIGHT SIDE ================= */}
      {!token ? (
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-5 py-2 rounded-full border text-sm hover:bg-gray-100 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          {/* ================= CART ================= */}
          <Link to="/cart" className="relative">
            <img
              src="/cart.svg"
              alt="Cart"
              className="w-6 h-6 cursor-pointer hover:opacity-70 transition"
            />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* ================= PROFILE ================= */}
          <div
            ref={dropdownRef}
            className="relative"
          >
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setOpen((prev) => !prev)}
            >
              <img
                src="/profile.svg"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />

              <span className="text-sm font-medium">
                {user?.name}
              </span>

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>

            {open && (
              <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-md w-48 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>

                <Link
                  to="/borrowed"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Borrowed List
                </Link>

                <Link
                  to="/reviews"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Reviews
                </Link>

                {/* ADMIN ONLY */}
                    {user?.role === "ADMIN" && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                <div className="border-t my-1"></div>

                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}