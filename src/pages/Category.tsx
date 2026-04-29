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

      const res = await axiosInstance.get("/api/books", {
        params,
      });

      return res.data;
    },
  });

  const books = Array.isArray(booksData?.data)
    ? booksData.data
    : Array.isArray(booksData?.data?.books)
    ? booksData.data.books
    : [];

  if (isLoading) {
    return (
      <div className="mt-20 text-center text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 text-xl font-semibold md:text-3xl">
        Book List
      </h1>

      {/* ===== MOBILE FILTER BUTTON ===== */}
      <div className="mb-4 md:hidden">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex w-full items-center justify-between rounded-2xl border bg-white px-5 py-4 shadow-sm"
        >
          <span className="text-sm font-semibold tracking-wide">
            FILTER
          </span>

          <div
            className={`flex flex-col items-end gap-1 transition-transform duration-300 ${
              showFilter ? "rotate-180" : ""
            }`}
          >
            <span className="h-0.5 w-4 rounded-full bg-black"></span>
            <span className="h-0.5 w-3 rounded-full bg-black"></span>
            <span className="h-0.5 w-2 rounded-full bg-black"></span>
          </div>
        </button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* ===== SIDEBAR FILTER ===== */}
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            md:block md:w-72
            ${
              showFilter
                ? "max-h-[600px] opacity-100"
                : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
            }
          `}
        >
          <div className="space-y-6 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold">FILTER</h2>

            {/* Category */}
            <div>
              <h3 className="mb-3 text-sm font-medium">
                Category
              </h3>

              <div className="space-y-2 text-sm">
                {categories.map((cat: any) => (
                  <label
                    key={cat.id}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={
                        selectedCategory === cat.id
                      }
                      onChange={() =>
                        setSelectedCategory(cat.id)
                      }
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="mb-3 text-sm font-medium">
                Rating
              </h3>

              <div className="space-y-2 text-sm">
                {[5, 4, 3, 2, 1].map((star) => (
                  <label
                    key={star}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={
                        selectedRating === star
                      }
                      onChange={() =>
                        setSelectedRating(star)
                      }
                    />
                    <span className="text-yellow-500">
                      ⭐ {star}
                    </span>
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

        {/* ===== BOOK GRID ===== */}
        <div className="flex-1">
          {books.length === 0 ? (
            <div className="text-center text-gray-500">
              No books found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {books.map((book: any) => (
                <Link
                  to={`/books/${book.id}`}
                  key={book.id}
                >
                  <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <img
                      src={
                        book.coverImage ||
                        "https://via.placeholder.com/150"
                      }
                      alt={book.title}
                      className="h-44 w-full object-cover md:h-56"
                    />

                    <div className="p-3">
                      <h3 className="line-clamp-1 text-sm font-medium">
                        {book.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
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