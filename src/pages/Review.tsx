import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import dayjs from "dayjs";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Review {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  book?: {
    title?: string;
    coverImage?: string;
    author?: {
      name?: string;
    };
    category?: {
      name?: string;
    };
  };
}

export default function Reviews() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery<Review[]>({
    queryKey: ["my-reviews"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/me/reviews");

      // 🔥 IMPORTANT FIX
      return res.data?.data?.reviews || [];
    },
  });

  // 🔍 SEARCH FILTER
  const filteredReviews = reviews.filter((review) =>
    review.comment
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // ⏳ LOADING
  if (isLoading) {
    return (
      <div className="text-center mt-20 text-sm text-gray-500">
        Loading reviews...
      </div>
    );
  }

  // ❌ ERROR
  if (isError) {
    return (
      <div className="text-center mt-20 text-sm text-red-500">
        Failed to load reviews.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold sm:text-xl">
            Reviews
          </h2>

          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Home
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-full border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* EMPTY */}
        {filteredReviews.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
            No reviews found.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow-sm p-5"
              >
                {/* DATE */}
                <p className="text-xs text-gray-400 mb-4">
                  {dayjs(review.createdAt).format(
                    "DD MMMM YYYY, HH:mm"
                  )}
                </p>

                {/* TOP */}
                <div className="flex gap-4">
                  {/* COVER */}
                  <img
                    src={
                      review.book?.coverImage ||
                      "/placeholder.png"
                    }
                    alt="book"
                    className="w-14 h-20 object-cover rounded-lg"
                  />

                  {/* INFO */}
                  <div className="flex-1">
                    {/* CATEGORY */}
                    <span className="text-[10px] px-2 py-1 bg-gray-100 rounded-md text-gray-500">
                      {review.book?.category?.name ||
                        "Category"}
                    </span>

                    {/* TITLE */}
                    <p className="font-semibold text-sm mt-1">
                      {review.book?.title ||
                        "Book Name"}
                    </p>

                    {/* AUTHOR */}
                    <p className="text-xs text-gray-400">
                      {review.book?.author?.name ||
                        "Author name"}
                    </p>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="border-t my-4" />

                {/* STARS */}
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= review.star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                {/* COMMENT */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}