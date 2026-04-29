import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { useAppDispatch } from "../app/hooks";
import { setAuth } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import type { LoginRequest, LoginResponse } from "../types/auth";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loginMutation = useMutation<
    LoginResponse,
    any,
    LoginRequest
  >({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post<LoginResponse>(
        "/api/auth/login",
        formData
      );
      return response.data;
    },

    onSuccess: (data) => {
      const token = data?.data?.token;
      const user = data?.data?.user;

      if (!token || !user) {
        setErrorMsg("Invalid response from server");
        return;
      }

      // ✅ simpan
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(setAuth({ token, user }));

      // hapus error saat user ngetik lagi
      if (errorMsg) setErrorMsg("");

      // 🔥 REDIRECT ROLE BASED
      if (user.role === "ADMIN") {
        navigate("/admin/books", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Login failed. Check your credentials.";

      setErrorMsg(message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    // VALIDASI SIMPLE
    if (!form.email || !form.password) {
      setErrorMsg("Email and password are required");
      return;
    }

    loginMutation.mutate(form);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // hapus error saat user ngetik lagi
    if (errorMsg) setErrorMsg("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-md">
        
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/logo.svg"
            alt="Booky Logo"
            className="w-7 h-7 object-contain"
          />
          <span className="font-semibold text-lg">Booky</span>
        </div>

        <h1 className="text-2xl font-bold">Login</h1>

        <p className="text-gray-500 text-sm mb-6">
          Sign in to manage your library account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* EMAIL */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm mb-1">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition font-medium disabled:bg-gray-300"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>

          {/* ERROR */}
          {errorMsg && (
            <p className="text-red-500 text-sm text-center">
              {errorMsg}
            </p>
          )}
        </form>

        {/* FOOTER */}
        <p className="text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}