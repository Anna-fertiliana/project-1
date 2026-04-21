import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface RegisterForm extends RegisterRequest {
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] =
    useState("");

  const registerMutation = useMutation({
    mutationFn: async (
      data: RegisterRequest
    ) => {
      const response = await axiosInstance.post(
        "/api/auth/register",
        data
      );

      return response.data;
    },

    onSuccess: () => {
      navigate("/login");
    },

    onError: () => {
      setErrorMessage(
        "Failed to register. Please try again."
      );
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrorMessage("");
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setErrorMessage(
        "Password confirmation does not match."
      );
      return;
    }

    const {
      name,
      email,
      phone,
      password,
    } = form;

    registerMutation.mutate({
      name,
      email,
      phone,
      password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-lg">
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
          Register
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Create your account to start borrowing books.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {errorMessage && (
            <p className="text-sm text-red-500">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition disabled:bg-gray-300"
          >
            {registerMutation.isPending
              ? "Loading..."
              : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}