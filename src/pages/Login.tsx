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

  const [showPassword, setShowPassword] =
    useState(false);

  const loginMutation = useMutation<
    LoginResponse,
    Error,
    LoginRequest
  >({
    mutationFn: async (formData) => {
      const response =
        await axiosInstance.post<LoginResponse>(
          "/api/auth/login",
          formData
        );

      return response.data;
    },

    onSuccess: ({ token, user }) => {
      dispatch(setAuth({ token, user }));

      navigate(
        user.role === "ADMIN"
          ? "/admin/users"
          : "/"
      );
    },

    onError: () => {
      console.error("Login failed");
    },
  });

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/logo.svg"
            alt="Booky Logo"
            className="w-7 h-7 object-contain"
          />
          <span className="font-semibold text-lg">
            Booky
          </span>
        </div>

        <h1 className="text-2xl font-bold">
          Login
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Sign in to manage your library account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition font-medium disabled:bg-gray-300"
          >
            {loginMutation.isPending
              ? "Loading..."
              : "Login"}
          </button>

          {loginMutation.isError && (
            <p className="text-red-500 text-sm text-center">
              Invalid email or password
            </p>
          )}
        </form>

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