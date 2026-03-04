import { useState } from "react";
import { useAppSelector } from "../app/hooks";

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Content */}
      <div className="flex-1 px-16 py-10">
        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-100 rounded-full p-1 flex gap-2">
            {["profile", "borrowed", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm transition ${
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
        <h2 className="text-lg font-semibold mb-6">Profile</h2>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 w-[420px]">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <img
              src="/profile.svg"
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />

            {/* Info */}
            <div className="flex-1 text-sm">
              <div className="flex justify-between mb-3">
                <span className="text-gray-500">Name</span>
                <span className="font-medium">
                  {user?.name || "John Doe"}
                </span>
              </div>

              <div className="flex justify-between mb-3">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">
                  {user?.email || "johndoe@email.com"}
                </span>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-gray-500">
                  Nomor Handphone
                </span>
                <span className="font-medium">
                  {user?.phone || "081234567890"}
                </span>
              </div>

              {/* Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full text-sm font-medium transition">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t py-10 text-center">
        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
          <span className="font-semibold text-lg">
            Booky
          </span>
        </div>

        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Discover inspiring stories & timeless knowledge,
          ready to borrow anytime. Explore online or visit our
          nearest library branch.
        </p>

        <div className="mt-6 text-sm font-medium">
          Follow on Social Media
        </div>

        <div className="flex justify-center gap-4 mt-4 text-gray-600">
          <div className="w-8 h-8 border rounded-full flex items-center justify-center">
            f
          </div>
          <div className="w-8 h-8 border rounded-full flex items-center justify-center">
            ig
          </div>
          <div className="w-8 h-8 border rounded-full flex items-center justify-center">
            in
          </div>
          <div className="w-8 h-8 border rounded-full flex items-center justify-center">
            t
          </div>
        </div>
      </div>
    </div>
  );
}