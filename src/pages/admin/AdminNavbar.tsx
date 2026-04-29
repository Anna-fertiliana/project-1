import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { logout, setViewMode } from "../../features/authSlice";
import { ChevronDown } from "lucide-react";

export default function AdminNavbar() {
  const { user, viewMode } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () =>
      document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSwitchToUser = () => {
    dispatch(setViewMode("USER"));
    navigate("/");
    setOpen(false);
  };

  const handleSwitchToAdmin = () => {
    dispatch(setViewMode("ADMIN"));
    navigate("/admin/books");
    setOpen(false);
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b bg-white">
      
      {/* LOGO */}
      <button
        onClick={() =>
          navigate(viewMode === "ADMIN" ? "/admin/books" : "/")
        }
        className="flex items-center gap-2"
      >
        <img src="/logo.svg" alt="Booky" className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="font-semibold text-base sm:text-lg">
          Booky
        </span>
      </button>

      {/* PROFILE */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 sm:gap-3"
        >
          {/* AVATAR */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs sm:text-sm font-semibold">
            {user?.name?.charAt(0) || "A"}
          </div>

          {/* NAME (HIDE DI MOBILE KECIL) */}
          <span className="hidden sm:block font-medium text-sm">
            {user?.name || "Admin"}
          </span>

          {/* ICON */}
          <ChevronDown
            size={16}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-50">
            
            {viewMode === "ADMIN" ? (
              <button
                onClick={handleSwitchToUser}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
              >
                View as User
              </button>
            ) : (
              <button
                onClick={handleSwitchToAdmin}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
              >
                Back to Dashboard
              </button>
            )}

            <div className="border-t" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}