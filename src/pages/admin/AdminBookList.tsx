import { useMemo, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function AdminBookList() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // ✅ modal state
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* TITLE */}
      <h1 className="text-lg font-semibold mb-4">
        Book List
      </h1>

      {isSuccess && (
        <div className="mb-4 flex justify-end">
          <div className="bg-green-500 text-white text-xs px-4 py-2 rounded-full shadow">
            Add Success
          </div>
        </div>
      )}

      {/* ADD BUTTON */}
      <button
          onClick={() => navigate("/admin/books/create")}
          className="mb-4 px-5 py-2 bg-[#2563EB] text-white rounded-full text-sm hover:bg-blue-700"
        >
          Add Book
        </button>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search book"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 bg-gray-100 rounded-full px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mb-6 flex-wrap text-xs">
        {["ALL", "AVAILABLE", "OUT_OF_STOCK"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-1.5 rounded-full transition ${
              filter === item
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {item.replace("_", " ").toLowerCase()}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-4 animate-pulse flex gap-4"
            >
              <div className="w-14 h-20 bg-gray-200 rounded-md" />
              <div className="flex-1 space-y-2">
                <div className="w-24 h-3 bg-gray-200 rounded" />
                <div className="w-40 h-4 bg-gray-200 rounded" />
                <div className="w-32 h-3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBooks.map((book: any) => (
            <div
              key={book.id}
              className="bg-white border rounded-xl p-4 flex justify-between items-center"
            >
              {/* LEFT */}
              <div className="flex gap-4">
                <img
                  src={book.coverImage || "/book-placeholder.png"}
                  alt={book.title}
                  className="w-14 h-20 object-cover rounded-md"
                />

                <div>
                  <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full">
                    {book.category?.name}
                  </span>

                  <h2 className="text-sm font-medium mt-1">
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

              {/* ACTION */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/books/${book.id}`)}
                  className="px-3 py-1 text-xs border rounded-full hover:bg-gray-100"
                >
                  Preview
                </button>

                <button
                  onClick={() =>
                    navigate(`/admin/books/edit/${book.id}`)
                  }
                  className="px-3 py-1 text-xs border rounded-full hover:bg-gray-100"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setSelectedBookId(book.id);
                    setIsDeleteOpen(true);
                  }}
                  className="px-3 py-1 text-xs text-red-500 border border-red-300 rounded-full hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredBooks.length === 0 && (
            <div className="text-center text-gray-400 py-10 text-sm">
              No books found
            </div>
          )}
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* OVERLAY */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setIsDeleteOpen(false)}
          />

          {/* MODAL */}
          <div className="relative bg-white w-[360px] rounded-2xl shadow-xl px-6 py-5 animate-[fadeIn_0.2s_ease]">

            <h2 className="text-base font-semibold text-gray-800">
              Delete Data
            </h2>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Once deleted, you won’t be able to recover this data.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (selectedBookId) {
                    deleteMutation.mutate(selectedBookId);
                  }
                }}
                className="px-5 py-2 rounded-full bg-[#E11D48] text-white text-sm font-medium hover:bg-pink-700 transition"
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