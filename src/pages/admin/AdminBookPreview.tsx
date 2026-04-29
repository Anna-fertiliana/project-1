import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api/axios";

export default function AdminBookPreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book-detail", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/books/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="py-20 text-center text-sm text-gray-500">
        Book not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm font-medium text-gray-600 hover:text-blue-600"
      >
        ← Preview Book
      </button>

      <div className="flex flex-col md:flex-row gap-8 md:gap-10">
        {/* Image */}
        <div className="w-full md:w-auto flex justify-center">
          <img
            src={book.coverImage || "/book-placeholder.png"}
            alt={book.title}
            className="w-48 sm:w-56 md:w-64 rounded-2xl object-cover shadow-sm"
          />
        </div>

        {/* Detail */}
        <div className="flex-1">
          <span className="inline-block text-xs bg-gray-100 px-3 py-1 rounded-full">
            {book.category?.name}
          </span>

          <h1 className="text-2xl sm:text-3xl font-semibold mt-3">
            {book.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {book.author?.name}
          </p>

          <p className="text-sm mt-3 text-yellow-500">
            ⭐ {book.rating ?? 0}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-6 mb-8 text-center sm:text-left">
            <div>
              <p className="font-semibold text-base">
                320
              </p>
              <p className="text-xs sm:text-sm text-gray-400">
                Pages
              </p>
            </div>

            <div>
              <p className="font-semibold text-base">
                212
              </p>
              <p className="text-xs sm:text-sm text-gray-400">
                Ratings
              </p>
            </div>

            <div>
              <p className="font-semibold text-base">
                179
              </p>
              <p className="text-xs sm:text-sm text-gray-400">
                Reviews
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-medium mb-2">
              Description
            </h3>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {book.description || "No description"}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="w-full sm:w-auto px-6 py-3 border rounded-full text-sm hover:bg-gray-50 transition">
              Add to Cart
            </button>

            <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition">
              Borrow Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}