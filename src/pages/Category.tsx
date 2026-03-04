import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { useState } from "react";

export default function Category() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  /* ================= GET CATEGORIES ================= */
  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/categories");
      return res.data;
    },
  });

  const categories = Array.isArray(categoryData?.data)
    ? categoryData.data
    : Array.isArray(categoryData?.data?.categories)
    ? categoryData.data.categories
    : [];

  /* ================= GET BOOKS ================= */
  const { data: booksData, isLoading } = useQuery({
    queryKey: ["books", selectedRating, selectedCategory],
    queryFn: async () => {
      const params: any = {};

      if (selectedRating) {
        params.rating = selectedRating;
      }

      if (selectedCategory) {
        params.categoryId = selectedCategory;
      }

      const res = await axiosInstance.get("/api/books", { params });
      return res.data;
    },
  });

  const books = Array.isArray(booksData?.data)
    ? booksData.data
    : Array.isArray(booksData?.data?.books)
    ? booksData.data.books
    : [];

  if (isLoading) {
    return <div className="mt-20 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-10">Book List</h1>

      <div className="grid grid-cols-12 gap-10">
        {/* ================= Sidebar ================= */}
        <div className="col-span-3">
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-8">
            <h2 className="font-semibold">FILTER</h2>

            {/* ===== Category Filter ===== */}
            <div>
              <h3 className="text-sm font-medium mb-4">Category</h3>

              <div className="space-y-3 text-sm">
                {categories.map((cat: any) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.id}
                      onChange={() => setSelectedCategory(cat.id)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ===== Rating Filter ===== */}
            <div>
              <h3 className="text-sm font-medium mb-4">Rating</h3>

              <div className="space-y-3 text-sm">
                {[5, 4, 3, 2, 1].map((star) => (
                  <label
                    key={star}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === star}
                      onChange={() => setSelectedRating(star)}
                    />
                    <span className="text-yellow-500">⭐ {star}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ===== Reset Filter ===== */}
            <button
              onClick={() => {
                setSelectedRating(null);
                setSelectedCategory(null);
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* ================= Book Grid ================= */}
        <div className="col-span-9">
          {books.length === 0 ? (
            <div className="text-center text-gray-500">
              No books found
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {books.map((book: any) => (
                <Link to={`/books/${book.id}`} key={book.id}>
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition overflow-hidden cursor-pointer">
                    <img
                      src={
                        book.coverImage ||
                        "https://via.placeholder.com/150"
                      }
                      alt={book.title}
                      className="w-full h-60 object-cover"
                    />

                    <div className="p-4">
                      <h3 className="text-sm font-medium line-clamp-1">
                        {book.title}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {book.author?.name}
                      </p>

                      <div className="mt-2 text-sm text-yellow-500">
                        ⭐ {book.rating || 4.9}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}