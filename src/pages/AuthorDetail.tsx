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
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm p-5 sm:p-8 mb-8">
          <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:items-start sm:text-left sm:gap-6">
            <img
              src={author?.avatar || "/profile.svg"}
              alt={author?.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-sm"
            />

            <div className="flex-1">
              <h2 className="text-lg sm:text-2xl font-semibold">
                {author?.name || "Unknown Author"}
              </h2>

              <div className="mt-2 flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
                <img
                  src="/book-icon.svg"
                  alt="book"
                  className="w-4 h-4"
                />
                <span>{books.length} Books</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section title */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg sm:text-2xl font-semibold">
            Book Collection
          </h1>

          <span className="text-xs sm:text-sm text-gray-500">
            {books.length} total
          </span>
        </div>

        {/* Empty state */}
        {books.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-sm text-gray-500 shadow-sm">
            This author has no published books yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
            {books.map((book: any) => (
              <Link
                to={`/books/${book.id}`}
                key={book.id}
              >
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-40 sm:h-52 lg:h-60 object-cover"
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