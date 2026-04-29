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

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const isAdmin =
    user?.role === "ADMIN";

  const isAdminViewingUser =
    isAdmin && viewMode === "USER";

  const showUserMenu =
    !isAdmin || isAdminViewingUser;

  const showCart =
    !isAdmin;

  useEffect(() => {
    const params = new URLSearchParams(
      location.search
    );
    setSearch(params.get("search") || "");
  }, [location.search]);

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

  useEffect(() => {
    const handleOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
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

    const keyword = search.trim();

    if (!keyword) {
      navigate("/books");
      return;
    }

    navigate(
      `/books?search=${encodeURIComponent(
        keyword
      )}`
    );
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center">
        {/* LEFT */}
        <div className="shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <img
              src="/logo.svg"
              alt="Booky"
              className="w-6 h-6"
            />
            <span className="font-semibold text-lg">
              Booky
            </span>
          </Link>
        </div>

        {/* CENTER */}
        <div className="flex-1 flex justify-center px-4">
          <form
            onSubmit={handleSearch}
            className="relative w-full max-w-2xl"
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
        <div className="shrink-0 ml-auto">
          {!token ? (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border text-sm hover:bg-gray-50"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              {/* CART hidden for admin */}
              {showCart && (
                <Link
                  to="/cart"
                  className="relative"
                >
                  <img
                    src="/cart.svg"
                    alt="Cart"
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
                    setOpen((prev) => !prev)
                  }
                  className="flex items-center gap-2"
                >
                  <img
                    src="/profile.svg"
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />

                  <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                    {user?.name}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg overflow-hidden">
                    {/* USER MENU */}
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
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}