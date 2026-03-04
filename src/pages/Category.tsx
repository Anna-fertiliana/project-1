import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { useState } from "react";

export default function Category() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);

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

      if (selectedRating) params.rating = selectedRating;
      if (selectedCategory) params.categoryId = selectedCategory;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-10">
        Book List
      </h1>

      {/* ===== Mobile Filter Button ===== */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="w-full bg-blue-600 text-white py-2 rounded-xl"
        >
          {showFilter ? "Close Filter" : "Open Filter"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ================= Sidebar ================= */}
        <div
          className={`${
            showFilter ? "block" : "hidden"
          } md:block w-full md:w-1/4`}
        >
          <div className="bg-white p-5 rounded-2xl shadow-sm space-y-6">
            <h2 className="font-semibold">FILTER</h2>

            {/* Category */}
            <div>
              <h3 className="text-sm font-medium mb-3">Category</h3>
              <div className="space-y-2 text-sm">
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

            {/* Rating */}
            <div>
              <h3 className="text-sm font-medium mb-3">Rating</h3>
              <div className="space-y-2 text-sm">
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
        <div className="flex-1">
          {books.length === 0 ? (
            <div className="text-center text-gray-500">
              No books found
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {books.map((book: any) => (
                <Link to={`/books/${book.id}`} key={book.id}>
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition overflow-hidden cursor-pointer">
                    <img
                      src={
                        book.coverImage ||
                        "https://via.placeholder.com/150"
                      }
                      alt={book.title}
                      className="w-full h-48 sm:h-60 object-cover"
                    />

                    <div className="p-3 sm:p-4">
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