import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import dayjs from "dayjs";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/books/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="text-center mt-20">
        Loading...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center mt-20">
        Book not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex gap-2 mb-8">
        <Link
          to="/"
          className="hover:text-blue-600"
        >
          Home
        </Link>

        <span>&gt;</span>

        <Link
          to="/category"
          className="hover:text-blue-600"
        >
          Category
        </Link>

        <span>&gt;</span>

        <span className="text-gray-700">
          {book.title}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full rounded-2xl shadow-md"
        />

        <div>
          <h1 className="text-3xl font-semibold">
            {book.title}
          </h1>

          <p className="text-gray-500 mt-2">
            {book.author?.name}
          </p>

          <div className="mt-4 text-sm">
            ⭐ {book.rating ?? 0} (
            {book.reviewCount ?? 0} reviews)
          </div>

          <p className="mt-6 text-gray-600 leading-relaxed">
            {book.description}
          </p>

          <div className="mt-8">
            <button
              onClick={() =>
                navigate("/borrow", {
                  state: { bookId: book.id },
                })
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Borrow Book
            </button>
          </div>
        </div>
      </div>

            {/* Reviews */}
      {Array.isArray(book.reviews) &&
        book.reviews.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">
              Reviews
            </h2>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {book.reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="bg-white p-5 rounded-2xl shadow-sm border"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/profile.svg"
                      alt="Reviewer"
                      className="w-9 h-9 rounded-full"
                    />

                    <div>
                      <p className="font-medium text-sm">
                        {review.user?.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {dayjs(review.createdAt).format(
                          "DD MMMM YYYY"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-yellow-500 text-sm">
                    ⭐ {review.rating}
                  </div>

                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}