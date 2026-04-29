import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  useAppSelector,
  useAppDispatch,
} from "../app/hooks";
import {
  logout,
  setViewMode,
} from "../features/authSlice";
import {
  ChevronDown,
  Search,
  Menu,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import {
  useState,
  useRef,
  useEffect,
} from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { user, token, viewMode } = useAppSelector(
    (state) => state.auth
  );

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "ADMIN";
  const isAdminViewingUser =
    isAdmin && viewMode === "USER";

  const showUserMenu =
    !isAdmin || isAdminViewingUser;

  const showCart = !isAdmin;

  // sync search query
  useEffect(() => {
    const params = new URLSearchParams(
      location.search
    );
    setSearch(params.get("search") || "");
  }, [location.search]);

  // cart
  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res =
        await axiosInstance.get("/api/cart");
      return res.data?.data || [];
    },
    enabled: !!token && showCart,
  });

  const cartCount = Array.isArray(data)
    ? data.length
    : 0;

  // close dropdown
  useEffect(() => {
    const handleOutside = (
      e: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          e.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    navigate(
      `/books?search=${encodeURIComponent(
        search.trim()
      )}`
    );
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b">
      <div className="relative max-w-7xl mx-auto px-4 py-3 flex items-center">

        {/* LEFT */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <img
              src="/logo.svg"
              alt="Booky"
              className="w-6 h-6"
            />
            <span className="font-semibold text-lg hidden sm:block">
              Booky
            </span>
          </Link>
        </div>

        {/* 🔥 CENTER SEARCH */}
        <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-full max-w-xl px-4">
          <form
            onSubmit={handleSearch}
            className="relative w-full"
          >
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-2 rounded-full border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </form>
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-4">

          {!token ? (
            <>
              {/* MOBILE ICON */}
              <button className="sm:hidden">
                <Search size={20} />
              </button>

              {/* HAMBURGER */}
              <button
                onClick={() =>
                  setMobileOpen(!mobileOpen)
                }
              >
                <Menu size={22} />
              </button>

              {/* DESKTOP LOGIN */}
              <Link
                to="/login"
                className="hidden sm:block text-sm text-blue-600 font-medium"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              {/* MOBILE SEARCH */}
              <button className="sm:hidden">
                <Search size={20} />
              </button>

              {/* CART */}
              {showCart && (
                <Link
                  to="/cart"
                  className="relative"
                >
                  <img
                    src="/cart.svg"
                    className="w-6 h-6"
                  />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                      {cartCount > 9
                        ? "9+"
                        : cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* PROFILE */}
              <div
                ref={dropdownRef}
                className="relative"
              >
                <button
                  onClick={() =>
                    setOpen(!open)
                  }
                  className="flex items-center gap-2"
                >
                  <img
                    src="/profile.svg"
                    className="w-8 h-8 rounded-full"
                  />

                  {/* NAME */}
                  <span className="hidden md:block text-sm font-medium max-w-[120px] truncate">
                    {user?.name}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg overflow-hidden">

                    {showUserMenu ? (
                      user?.role === "ADMIN" ? (
                        <button
                          onClick={() => {
                            dispatch(
                              setViewMode(
                                "ADMIN"
                              )
                            );
                            navigate(
                              "/admin/books"
                            );
                            setOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          Back to Dashboard
                        </button>
                      ) : (
                        <>
                          <Link
                            to="/profile"
                            onClick={() =>
                              setOpen(false)
                            }
                            className="block px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            Profile
                          </Link>

                          <Link
                            to="/borrowed"
                            onClick={() =>
                              setOpen(false)
                            }
                            className="block px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            Borrowed
                          </Link>

                          <Link
                            to="/reviews"
                            onClick={() =>
                              setOpen(false)
                            }
                            className="block px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            Reviews
                          </Link>
                        </>
                      )
                    ) : (
                      <button
                        onClick={() => {
                          dispatch(
                            setViewMode(
                              "USER"
                            )
                          );
                          navigate("/");
                          setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        View as User
                      </button>
                    )}

                    <div className="border-t" />

                    <button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && !token && (
        <div className="sm:hidden border-t bg-white px-4 py-3 flex flex-col gap-3">
          <Link
            to="/login"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}