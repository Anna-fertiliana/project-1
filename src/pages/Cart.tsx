import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate(); // ✅ PINDAH KE SINI
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
    return <div className="mt-20 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">My Cart</h1>

      <div className="grid md:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              checked={
                cartItems.length > 0 &&
                selected.length === cartItems.length
              }
              onChange={toggleSelectAll}
              className="w-4 h-4"
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
                  className="flex items-center gap-4 border-b pb-6"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4"
                  />

                  <img
                    src={
                      book.coverImage ||
                      "https://via.placeholder.com/80x110"
                    }
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-md"
                  />

                  <div>
                    <span className="inline-block text-xs bg-gray-100 px-3 py-1 rounded-full mb-2">
                      {book.category?.name}
                    </span>

                    <h3 className="font-medium text-sm">
                      {book.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {book.author?.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
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
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition disabled:bg-gray-300"
            >
              Borrow Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}