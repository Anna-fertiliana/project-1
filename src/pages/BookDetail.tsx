import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";

const BookDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ================= GET BOOK ================= */
  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/books/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  /* ================= RELATED ================= */
  const { data: relatedBooks } = useQuery({
    queryKey: ["related-books", book?.category?.id],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/books", {
        params: {
          categoryId: book?.category?.id,
          limit: 6,
        },
      });

      const data = res.data?.data;
      return Array.isArray(data)
        ? data
        : Array.isArray(data?.books)
        ? data.books
        : [];
    },
    enabled: !!book?.category?.id,
  });

  if (isLoading)
    return <div className="text-center mt-20">Loading...</div>;

  if (!book)
    return <div className="text-center mt-20">Book not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* ================= Breadcrumb ================= */}
      <div className="text-xs sm:text-sm text-gray-400 mb-6 flex flex-wrap gap-2">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <span>&gt;</span>
        <Link to="/category" className="hover:text-blue-600">
          Category
        </Link>
        <span>&gt;</span>
        <span className="text-gray-600 line-clamp-1">
          {book.title}
        </span>
      </div>

      {/* ================= Top Section ================= */}
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">

        {/* Cover */}
        <div>
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full max-h-[500px] object-cover rounded-2xl shadow-md"
          />
        </div>

        {/* Info */}
        <div>
          {book.category?.name && (
            <span className="inline-block px-3 py-1 text-xs bg-gray-100 rounded-full mb-4">
              {book.category.name}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
            {book.title}
          </h1>

          {book.author?.id && (
            <Link
              to={`/authors/${book.author.id}`}
              className="block text-gray-500 mt-2 hover:text-blue-600 transition"
            >
              {book.author.name}
            </Link>
          )}

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-yellow-500">⭐</span>
            <span className="font-medium">
              {book.rating ?? 0}
            </span>
            <span className="text-gray-400">
              ({book.reviewCount ?? 0} reviews)
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center text-sm">
            <div>
              <p className="font-semibold text-lg">
                {book.page}
              </p>
              <p className="text-gray-400">Pages</p>
            </div>

            <div>
              <p className="font-semibold text-lg">
                {book.rating ?? 0}
              </p>
              <p className="text-gray-400">Rating</p>
            </div>

            <div>
              <p className="font-semibold text-lg">
                {book.reviewCount ?? 0}
              </p>
              <p className="text-gray-400">Reviews</p>
            </div>
          </div>

          <div className="border-t my-6"></div>

          <h3 className="font-semibold mb-2">Description</h3>

          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            {book.description}
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
              Add to Cart
            </button>

            <button
              onClick={() =>
                navigate("/borrow", {
                  state: { bookId: book.id },
                })
              }
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Borrow
            </button>
          </div>
        </div>
      </div>

      {/* ================= Review Section ================= */}
      {Array.isArray(book.reviews) && book.reviews.length > 0 && (
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
                    className="w-9 h-9 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {review.user?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {review.createdAt}
                    </p>
                  </div>
                </div>

                <div className="mt-2 text-yellow-500 text-sm">
                  ⭐ {review.rating}
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= Related ================= */}
      {relatedBooks?.length > 0 && (
        <div className="mt-16 sm:mt-20">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            Related Books
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {relatedBooks
              .filter((item: any) => item.id !== book.id)
              .map((item: any) => (
                <Link
                  to={`/books/${item.id}`}
                  key={item.id}
                >
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition overflow-hidden">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-48 sm:h-56 object-cover"
                    />

                    <div className="p-3">
                      <h3 className="text-sm font-medium line-clamp-1">
                        {item.title}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {item.author?.name}
                      </p>

                      <div className="mt-2 text-xs text-yellow-500">
                        ⭐ {item.rating ?? 0}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* ================= Sticky Borrow Button (Mobile Only) ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 sm:hidden">
        <button
          onClick={() =>
            navigate("/borrow", {
              state: { bookId: book.id },
            })
          }
          className="w-full bg-blue-600 text-white py-3 rounded-full font-medium"
        >
          Borrow This Book
        </button>
      </div>
    </div>
  );
};

export default BookDetail;