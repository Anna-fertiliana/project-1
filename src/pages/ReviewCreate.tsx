import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
        queryClient.invalidateQueries({ queryKey: ["my-loans"] });
        queryClient.invalidateQueries({ queryKey: ["book", bookId] });
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {/* Modal */}
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg">
        
        {/* Close button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-center mb-4">
          Give Review
        </h2>

        {/* Rating */}
        <p className="text-sm text-gray-500 text-center mb-2">
          Give Rating
        </p>

        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-2xl cursor-pointer ${
                star <= (hover || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment */}
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please share your thoughts about this book"
          className="w-full border rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={reviewMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full"
        >
          {reviewMutation.isPending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}