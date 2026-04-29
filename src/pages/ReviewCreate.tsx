import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";

export default function ReviewCreate() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(4);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const reviewMutation = useMutation({
    mutationFn: async () => {
      return axiosInstance.post("/api/reviews", {
        bookId: Number(bookId),
        star: Number(rating),
        comment: comment.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-loans"],
      });

      queryClient.invalidateQueries({
        queryKey: ["book", bookId],
      });

      navigate(`/reviews/${bookId}`);
    },
    onError: () => {
      setError("Failed to submit review.");
    },
  });

  const handleSubmit = () => {
    if (!comment.trim()) {
      setError("Comment is required.");
      return;
    }

    setError("");
    reviewMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="w-full bg-white rounded-t-3xl sm:rounded-2xl sm:max-w-md p-5 sm:p-6 shadow-xl relative">
        {/* Close */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-lg"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">
          Give Review
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 text-center mb-3">
          Give Rating
        </p>

        {/* Rating */}
        <div className="flex justify-center gap-1 mb-5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={`text-3xl sm:text-2xl transition ${
                star <= (hover || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Comment */}
        <textarea
          rows={5}
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          placeholder="Please share your thoughts about this book"
          className="w-full border rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {error && (
          <p className="text-sm text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={reviewMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium transition disabled:bg-gray-300"
        >
          {reviewMutation.isPending
            ? "Sending..."
            : "Send Review"}
        </button>
      </div>
    </div>
  );
}