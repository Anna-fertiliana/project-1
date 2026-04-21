import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import dayjs from "dayjs";
import { Star } from "lucide-react";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  book?: {
    title?: string;
    coverImage?: string;
    category?: {
      name?: string;
    };
    author?: {
      name?: string;
    };
  };
}

export default function Reviews() {
  const [search, setSearch] = useState("");

  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/reviews");

      if (Array.isArray(res.data)) {
        return res.data;
      }

      return res.data.data;
    },
  });

  const filteredReviews = reviews.filter((review) =>
    review.book?.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="text-center mt-16">
        Loading reviews...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-16 text-red-500">
        Failed to load reviews.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-6">
          Reviews
        </h2>

        <div className="mb-6 sm:mb-8">
          <input
            type="text"
            placeholder="Search Reviews"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full sm:w-80 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredReviews.length === 0 ? (
          <p className="text-gray-400 mt-8">
            No reviews found.
          </p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6"
              >
                <p className="text-xs text-gray-500 mb-4">
                  {dayjs(review.createdAt).format(
                    "DD MMMM YYYY, HH:mm"
                  )}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-t pt-4 sm:pt-6">
                  <img
                    src={
                      review.book?.coverImage ||
                      "https://via.placeholder.com/80x110"
                    }
                    alt={review.book?.title}
                    className="w-24 sm:w-20 h-32 sm:h-28 object-cover rounded-lg mx-auto sm:mx-0"
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                      {review.book?.category?.name}
                    </span>

                    <h3 className="font-medium mt-3">
                      {review.book?.title}
                    </h3>

                    <p className="text-sm text-gray-500 mb-3">
                      {review.book?.author?.name}
                    </p>

                    <div className="flex justify-center sm:justify-start gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={
                            star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-sm text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}