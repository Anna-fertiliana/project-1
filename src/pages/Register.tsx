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

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await axiosInstance.post(
        "/api/auth/register",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Password tidak sama");
      return;
    }

    registerMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-lg">

        {/* Logo */}
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
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Nomor Handphone"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={handleChange}
            required
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
          >
            {registerMutation.isPending
              ? "Loading..."
              : "Submit"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-600 font-medium"
          >
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;