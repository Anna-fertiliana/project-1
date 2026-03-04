import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import dayjs from "dayjs";
import { Star } from "lucide-react";

export default function Reviews() {
  const [search, setSearch] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/reviews");

      // kalau backend return langsung array
      if (Array.isArray(res.data)) return res.data;

      // kalau backend return { data: [...] }
      return res.data.data;
    },
  });

  const filteredReviews = reviews.filter((review: any) =>
    review.book?.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-16 py-10">
      <h2 className="text-lg font-semibold mb-6">Reviews</h2>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search Reviews"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[400px] border rounded-full px-4 py-2 text-sm"
        />
      </div>

      {/* Reviews List */}
      <div className="space-y-6 max-w-3xl">
        {filteredReviews.map((review: any) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            {/* Date */}
            <p className="text-xs text-gray-500 mb-4">
              {dayjs(review.createdAt).format(
                "DD MMMM YYYY, HH:mm"
              )}
            </p>

            <div className="flex gap-6 border-t pt-6">
              {/* Cover */}
              <img
                src={
                  review.book?.coverImage ||
                  "https://via.placeholder.com/80x110"
                }
                alt={review.book?.title}
                className="w-20 h-28 object-cover rounded-lg"
              />

              {/* Book Info */}
              <div className="flex-1">
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                  {review.book?.category?.name}
                </span>

                <h3 className="font-medium mt-3">
                  {review.book?.title}
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  {review.book?.author?.name}
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-3">
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

                {/* Comment */}
                <p className="text-sm text-gray-600">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReviews.length === 0 && (
        <p className="text-gray-400 mt-10">
          No reviews found.
        </p>
      )}
    </div>
  );
}