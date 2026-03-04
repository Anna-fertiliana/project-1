import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminBookList() {
  const [filter, setFilter] = useState("ALL");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  /* ================= FETCH BOOKS ================= */
  const { data, isLoading } = useQuery({
    queryKey: ["admin-books", filter],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/admin/books", {
        params: { status: filter === "ALL" ? undefined : filter },
      });
      return res.data;
    },
  });

  const books = data?.data || [];

  /* ================= DELETE BOOK ================= */
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/api/admin/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
    },
  });

  return (
    <div className="space-y-6">
      {/* ===== Title ===== */}
      <h1 className="text-xl font-semibold">Book List</h1>

      {/* ===== Add Book Button ===== */}
      <div>
        <button className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700">
          Add Book
        </button>
      </div>

      {/* ===== Search ===== */}
      <div>
        <input
          type="text"
          placeholder="Search book"
          className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ===== Filter Tabs ===== */}
      <div className="flex gap-3 text-sm">
        {["ALL", "AVAILABLE", "BORROWED", "RETURNED"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-1.5 rounded-full border ${
              filter === item
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {item.charAt(0) + item.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* ===== Book List ===== */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {books.map((book: any) => (
            <div
              key={book.id}
              className="flex justify-between items-center bg-white border rounded-xl p-4 shadow-sm"
            >
              {/* ===== LEFT SIDE ===== */}
              <div className="flex gap-4">
                <img
                  src={book.image || "/book-placeholder.png"}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded-md"
                />

                <div className="space-y-1">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {book.category}
                  </span>

                  <h2 className="font-semibold">{book.title}</h2>

                  <p className="text-sm text-gray-500">
                    {book.author}
                  </p>

                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    ⭐ {book.rating || 4.5}
                  </div>
                </div>
              </div>

              {/* ===== RIGHT SIDE BUTTONS ===== */}
              <div className="flex gap-2">
                <button className="px-4 py-1.5 text-sm border rounded-full hover:bg-gray-100">
                  Preview
                </button>

                <button
                onClick={() => navigate(`/admin/books/edit/${book.id}`)}
                className="px-4 py-1.5 text-sm border rounded-full hover:bg-gray-100"
                >
                Edit
                </button>

                <button
                  onClick={() => deleteMutation.mutate(book.id)}
                  className="px-4 py-1.5 text-sm border border-red-500 text-red-500 rounded-full hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {books.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              No books found
            </div>
          )}
        </div>
      )}
    </div>
  );
}