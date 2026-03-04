import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { useNavigate } from "react-router-dom";

const BookDetail = () => {
  const navigate = useNavigate();
const { id } = useParams();

  /* =========================
     GET DETAIL BOOK
  ========================= */
  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/books/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  /* =========================
     GET RELATED BOOKS
  ========================= */
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
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* ================= Breadcrumb ================= */}
      <div className="text-sm text-gray-400 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>

        <span>&gt;</span>

        <Link to="/category" className="hover:text-blue-600">
          Category
        </Link>

        <span>&gt;</span>

        <span className="text-gray-600">{book.title}</span>
      </div>

      {/* ================= Top Section ================= */}
      <div className="grid md:grid-cols-2 gap-16">
        {/* Cover */}
        <div>
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full rounded-2xl shadow-lg"
          />
        </div>

        {/* Info */}
        <div>
          {/* Category Badge */}
          {book.category?.name && (
            <span className="inline-block px-4 py-1 text-xs bg-gray-100 rounded-full mb-4">
              {book.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl font-semibold leading-tight">
            {book.title}
          </h1>

          {/* Author */}
          {book.author?.id && (
            <Link
              to={`/authors/${book.author.id}`}
              className="block text-gray-500 mt-3 hover:text-blue-600 hover:underline transition"
            >
              {book.author.name}
            </Link>
          )}

          {/* Rating */}
          <div className="mt-6 flex items-center gap-2 text-sm">
            <span className="text-yellow-500">⭐</span>
            <span className="font-medium">
              {book.rating ?? 0}
            </span>
            <span className="text-gray-400">
              ({book.reviewCount ?? 0} reviews)
            </span>
          </div>

          {/* Stats Row */}
          <div className="flex gap-16 mt-8 text-sm">
            <div>
              <p className="text-xl font-semibold">
                {book.page}
              </p>
              <p className="text-gray-400">Page</p>
            </div>

            <div>
              <p className="text-xl font-semibold">
                {book.rating}
              </p>
              <p className="text-gray-400">Rating</p>
            </div>

            <div>
              <p className="text-xl font-semibold">
                {book.reviewCount}
              </p>
              <p className="text-gray-400">Reviews</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t my-8"></div>

          {/* Description */}
          <h3 className="font-semibold mb-3">
            Description
          </h3>

          <p className="text-gray-600 leading-relaxed">
            {book.description}
          </p>

          {/* Buttons */}
          <div className="mt-10 flex gap-4">
            <button className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
              Add to Cart
            </button>

            <button
              onClick={() =>
                navigate("/borrow", {
                  state: { bookId: book.id },
                })
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Borrow
            </button>
          </div>
        </div>
      </div>

      {/* ================= Review Section ================= */}
      {Array.isArray(book.reviews) && book.reviews.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-semibold mb-2">
            Review
          </h2>

          <div className="flex items-center gap-2 text-sm mb-8">
            <span className="text-yellow-500">⭐</span>
            <span className="font-medium">
              {book.rating}
            </span>
            <span className="text-gray-500">
              ({book.reviewCount} Ulasan)
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {book.reviews.map((review: any) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <img
                    src="/profile.svg"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">
                      {review.user?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {review.createdAt}
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-yellow-500 text-sm">
                  ⭐ {review.rating}
                </div>

                <p className="text-sm text-gray-600 mt-3">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= Related Books ================= */}
      {relatedBooks?.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-semibold mb-6">
            Related Books
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {relatedBooks
              .filter((item: any) => item.id !== book.id)
              .map((item: any) => (
                <Link
                  to={`/books/${item.id}`}
                  key={item.id}
                >
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition overflow-hidden cursor-pointer">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-60 object-cover"
                    />

                    <div className="p-4">
                      <h3 className="text-sm font-medium line-clamp-1">
                        {item.title}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {item.author?.name}
                      </p>

                      <div className="mt-2 text-sm text-yellow-500">
                        ⭐ {item.rating}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;