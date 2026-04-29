import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/cart");
      return res.data;
    },
  });

  const cartItems = Array.isArray(data?.data) ? data.data : [];

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
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-6 text-lg font-semibold md:text-2xl">
        My Cart
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* LEFT */}
        <div className="md:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                cartItems.length > 0 &&
                selected.length === cartItems.length
              }
              onChange={toggleSelectAll}
              className="h-5 w-5"
            />
            <span className="text-sm text-gray-600">
              Select All
            </span>
          </div>

          <div className="space-y-5">
            {cartItems.map((item: any) => {
              const book = item.book;

              return (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="mt-2 h-5 w-5"
                  />

                  <img
                    src={
                      book.coverImage ||
                      "https://via.placeholder.com/80x110"
                    }
                    alt={book.title}
                    className="h-24 w-16 rounded-lg object-cover md:h-28 md:w-20"
                  />

                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs">
                      {book.category?.name}
                    </span>

                    <h3 className="mt-2 text-sm font-medium md:text-base line-clamp-2">
                      {book.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 md:text-sm">
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
          <div className="rounded-2xl bg-white p-5 shadow-sm md:sticky md:top-24">
            <h2 className="mb-5 font-semibold">
              Loan Summary
            </h2>

            <div className="mb-6 flex justify-between text-sm">
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
                  state: {
                    selectedBooks: selected,
                  },
                })
              }
              className="w-full rounded-full bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Borrow Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}