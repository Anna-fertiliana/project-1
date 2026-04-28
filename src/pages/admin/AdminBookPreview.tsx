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
  });

  if (isLoading) return <p>Loading...</p>;

  if (!book) return <p>Book not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm font-bold text-gray-600 hover:underline"
      >
        ← Preview Book
      </button>

      <div className="flex gap-10">
        {/* IMAGE */}
        <img
          src={book.coverImage || "/book-placeholder.png"}
          alt={book.title}
          className="w-56 h-80 object-cover rounded-md"
        />

        {/* DETAIL */}
        <div className="flex-1">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            {book.category?.name}
          </span>

          <h1 className="text-2xl font-semibold mt-2">
            {book.title}
          </h1>

          <p className="text-sm text-gray-500 mb-2">
            {book.author?.name}
          </p>

          <p className="text-sm mb-4">
            ⭐ {book.rating ?? 0}
          </p>

          {/* STATS */}
          <div className="flex gap-10 mb-6 text-sm">
            <div>
              <p className="font-semibold">320</p>
              <p className="text-gray-400">Page</p>
            </div>
            <div>
              <p className="font-semibold">212</p>
              <p className="text-gray-400">Rating</p>
            </div>
            <div>
              <p className="font-semibold">179</p>
              <p className="text-gray-400">Reviews</p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm text-gray-600">
              {book.description || "No description"}
            </p>
          </div>

          {/* BUTTON */}
          <div className="flex gap-3">
            <button className="px-5 py-2 border rounded-full text-sm">
              Add to Cart
            </button>

            <button className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm">
              Borrow Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}