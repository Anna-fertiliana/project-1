import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number[]>([]);

  /* ================= GET CART ================= */
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/cart");
      return res.data;
    },
  });

  const cartItems = Array.isArray(data?.data) ? data.data : [];

  /* ================= SELECT HANDLER ================= */
  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === cartItems.length) {
      setSelected([]);
    } else {
      setSelected(cartItems.map((item: any) => item.id));
    }
  };

  if (isLoading) {
    return (
      <div className="mt-20 text-center text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">
        My Cart
      </h1>

      <div className="grid gap-10 md:grid-cols-3">
        
        {/* LEFT - CART ITEMS */}
        <div className="md:col-span-2">
          
          {/* Select All */}
          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              checked={
                cartItems.length > 0 &&
                selected.length === cartItems.length
              }
              onChange={toggleSelectAll}
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-600">
              Select All
            </span>
          </div>

          <div className="space-y-6">
            {cartItems.map((item: any) => {
              const book = item.book;

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-4 border-b pb-6"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-5 h-5 mt-2"
                  />

                  <img
                    src={
                      book.coverImage ||
                      "https://via.placeholder.com/80x110"
                    }
                    alt={book.title}
                    className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    <span className="inline-block text-xs bg-gray-100 px-3 py-1 rounded-full mb-2">
                      {book.category?.name}
                    </span>

                    <h3 className="font-medium text-sm sm:text-base">
                      {book.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {book.author?.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT - SUMMARY */}
        <div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 md:sticky md:top-24">
            <h2 className="font-semibold mb-6">
              Loan Summary
            </h2>

            <div className="flex justify-between text-sm mb-6">
              <span className="text-gray-500">
                Total Book
              </span>
              <span className="font-medium">
                {selected.length} Items
              </span>
            </div>

            <button
              disabled={selected.length === 0}
              onClick={() =>
                navigate("/borrow", {
                  state: { selectedBooks: selected },
                })
              }
              className="w-full bg-blue-600 text-white py-3 rounded-full 
                         hover:bg-blue-700 transition 
                         disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Borrow Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}