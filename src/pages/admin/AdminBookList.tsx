import { useMemo, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminBookList() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const isSuccess = new URLSearchParams(location.search).get("success");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/admin/books");
      return res.data?.data?.books || [];
    },
  });

  const books = data || [];

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/api/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-books"],
      });
      setIsDeleteOpen(false);
      setSelectedBookId(null);
    },
  });

  const filteredBooks = useMemo(() => {
    return books
      .filter((book: any) => {
        if (filter === "AVAILABLE") return book.availableCopies > 0;
        if (filter === "OUT_OF_STOCK") return book.availableCopies === 0;
        return true;
      })
      .filter((book: any) =>
        book.title?.toLowerCase().includes(search.toLowerCase())
      );
  }, [books, filter, search]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-lg sm:text-xl font-semibold">
          Book List
        </h1>

        <button
          onClick={() => navigate("/admin/books/create")}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition"
        >
          Add Book
        </button>
      </div>

      {isSuccess && (
        <div className="mb-4">
          <div className="inline-block bg-green-500 text-white text-xs px-4 py-2 rounded-full shadow">
            Add Success
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search book"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {["ALL", "AVAILABLE", "OUT_OF_STOCK"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs transition ${
              filter === item
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {item.replace("_", " ").toLowerCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {filteredBooks.map((book: any) => (
          <div
            key={book.id}
            className="bg-white border rounded-2xl p-4"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              {/* Left */}
              <div className="flex gap-4">
                <img
                  src={book.coverImage || "/book-placeholder.png"}
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded-lg"
                />

                <div>
                  <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full">
                    {book.category?.name}
                  </span>

                  <h2 className="text-sm font-medium mt-2">
                    {book.title}
                  </h2>

                  <p className="text-xs text-gray-500">
                    {book.author?.name}
                  </p>

                  <div className="text-[11px] text-gray-400 mt-1">
                    ⭐ {book.rating ?? 0} · Stock {book.availableCopies}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <button
                  onClick={() => navigate(`/admin/books/${book.id}`)}
                  className="px-3 py-2 text-xs border rounded-full hover:bg-gray-100"
                >
                  Preview
                </button>

                <button
                  onClick={() =>
                    navigate(`/admin/books/edit/${book.id}`)
                  }
                  className="px-3 py-2 text-xs border rounded-full hover:bg-gray-100"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setSelectedBookId(book.id);
                    setIsDeleteOpen(true);
                  }}
                  className="px-3 py-2 text-xs text-red-500 border border-red-300 rounded-full hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && filteredBooks.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-sm">
            No books found
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsDeleteOpen(false)}
          />

          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold">
              Delete Data
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Once deleted, you won’t be able to recover this data.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 rounded-full border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (selectedBookId) {
                    deleteMutation.mutate(selectedBookId);
                  }
                }}
                className="flex-1 rounded-full bg-red-600 px-4 py-2 text-sm text-white"
              >
                {deleteMutation.isPending
                  ? "Deleting..."
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}