import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";

export default function AuthorDetail() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["booksByAuthor", id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/authors/${id}/books`
      );
      return res.data.data;
    },
    enabled: !!id,
  });

  const books = Array.isArray(data?.books)
    ? data.books
    : Array.isArray(data)
    ? data
    : [];

  const author =
    books.length > 0 ? books[0].author : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">

        {/* ================= Author Header ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-10">

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">

            <img
              src={author?.avatar || "/profile.svg"}
              alt={author?.name}
              className="w-24 h-24 rounded-full object-cover shadow-sm"
            />

            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {author?.name || "Unknown Author"}
              </h2>

              <div className="mt-2 flex justify-center sm:justify-start items-center gap-2 text-sm text-gray-500">
                <img
                  src="/book-icon.svg"
                  alt="book icon"
                  className="w-4 h-4"
                />
                <span>{books.length} Books</span>
              </div>
            </div>
          </div>

        </div>

        {/* ================= Book Section ================= */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg sm:text-2xl font-semibold">
            Book Collection
          </h1>

          <span className="text-xs sm:text-sm text-gray-500">
            {books.length} total
          </span>
        </div>

        {books.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-sm text-gray-500 shadow-sm">
            This author has no published books yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">

            {books.map((book: any) => (
              <Link
                to={`/books/${book.id}`}
                key={book.id}
              >
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition overflow-hidden">

                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-44 sm:h-52 lg:h-60 object-cover"
                  />

                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-medium line-clamp-1">
                      {book.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {author?.name}
                    </p>

                    <div className="mt-2 text-xs sm:text-sm text-yellow-500">
                      ⭐ {book.rating ?? 0}
                    </div>
                  </div>

                </div>
              </Link>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}