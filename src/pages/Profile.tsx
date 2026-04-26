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
      navigate("/reviews/16");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-full p-1 flex gap-1 sm:gap-2 overflow-x-auto">
              {["profile", "borrowed", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTab(tab)}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition ${
                    activeTab === tab
                      ? "bg-white shadow text-black"
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

          {/* Title */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-semibold">
              Profile
            </h2>

          <button
            onClick={() => navigate("/")}
            className="mb-4 text-sm text-blue-600 hover:underline"
          >
            ← Back to Home
          </button>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 w-full">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* Avatar */}
              <img
                src="/profile.svg"
                alt="Profile"
                className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover"
              />

              {/* Info */}
              <div className="flex-1 text-sm w-full">

                <div className="flex justify-between mb-3">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-right">
                    {user?.name || "John Doe"}
                  </span>
                </div>

                <div className="flex justify-between mb-3">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-right">
                    {user?.email || "johndoe@email.com"}
                  </span>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="text-gray-500">
                    Nomor Handphone
                  </span>
                  <span className="font-medium text-right">
                    {user?.phone || "081234567890"}
                  </span>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-full text-sm font-medium transition">
                  Update Profile
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t py-8 sm:py-10 text-center px-4">
        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full"></div>
          <span className="font-semibold text-base sm:text-lg">
            Booky
          </span>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Discover inspiring stories & timeless knowledge,
          ready to borrow anytime. Explore online or visit our
          nearest library branch.
        </p>

        <div className="mt-6 text-xs sm:text-sm font-medium">
          Follow on Social Media
        </div>

        <div className="flex justify-center gap-3 sm:gap-4 mt-4 text-gray-600">
          {["f", "ig", "in", "t"].map((item, i) => (
            <div
              key={i}
              className="w-8 h-8 border rounded-full flex items-center justify-center text-xs"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}