import { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const handleTab = (tab: string) => {
    setActiveTab(tab);

    if (tab === "borrowed") {
      navigate("/borrowed");
    }

    if (tab === "reviews") {
      navigate("/reviews");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-3xl">

          {/* ================= TABS ================= */}
          <div className="mb-6 flex justify-center">
            <div className="flex gap-1 overflow-x-auto rounded-full bg-gray-100 p-1">
              {["profile", "borrowed", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTab(tab)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs transition md:px-6 md:text-sm ${
                    activeTab === tab
                      ? "bg-white text-black shadow"
                      : "text-gray-500"
                  }`}
                >
                  {tab === "profile"
                    ? "Profile"
                    : tab === "borrowed"
                    ? "Borrowed List"
                    : "Reviews"}
                </button>
              ))}
            </div>
          </div>

          {/* ================= HEADER ================= */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold md:text-xl">
              Profile
            </h2>

            <button
              onClick={() => navigate("/")}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back
            </button>
          </div>

          {/* ================= CARD ================= */}
          <div className="w-full rounded-2xl bg-white p-5 shadow-sm md:p-8">

            {/* 🔥 FIXED HEADER PROFILE */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/profile.svg"
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />

              <div>
                <h3 className="font-semibold text-lg">
                  {user?.name || "John Doe"}
                </h3>
                <p className="text-sm text-gray-500">
                  {user?.email || "johndoe@email.com"}
                </p>
              </div>
            </div>

            {/* ================= INFO ================= */}
            <div className="text-sm">
              <div className="mb-4 flex justify-between">
                <span className="text-gray-500">
                  Phone
                </span>
                <span className="font-medium">
                  {user?.phone || "081234567890"}
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <button className="w-full mt-6 rounded-full bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}