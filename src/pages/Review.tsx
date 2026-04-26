import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import dayjs from "dayjs";
import { Star } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";


interface Review {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user?: {
    name?: string;
  };
}

export default function Reviews() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery<Review[]>({
    queryKey: ["reviews", bookId],
    queryFn: async () => {
  if (bookId) {
    const res = await axiosInstance.get(
      `/api/reviews/book/${bookId}`
    );
    return res.data?.data?.reviews || [];
  } else {
    const res = await axiosInstance.get(`/api/reviews`);
    return res.data?.data || [];
  }
},
enabled: true,
  });


  const filteredReviews = reviews.filter((review) =>
    review.comment
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // Loading
  if (isLoading) {
    return (
      <div className="text-center mt-20 text-sm text-gray-500">
        Loading reviews...
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="text-center mt-20 text-red-500 text-sm">
        Failed to load reviews.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">
            Reviews
          </h2>

          <button
            onClick={() => navigate("/")}
            className="mb-4 text-sm text-blue-600 hover:underline"
          >
            ← Back to Home
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 sm:mb-8">
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full sm:w-80 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Empty */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-sm text-gray-400 shadow-sm">
            No reviews found.
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6"
              >
                {/* Date */}
                <p className="text-xs text-gray-500 mb-2">
                  {dayjs(review.createdAt).format(
                    "DD MMMM YYYY, HH:mm"
                  )}
                </p>

                {/* User */}
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {review.user?.name || "Anonymous"}
                </p>

                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= review.star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-gray-600">
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