import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";


export default function AuthorDetail() {
  const { id } = useParams();

  /* ================= GET BOOKS BY AUTHOR ================= */
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

  const author = books.length > 0 ? books[0].author : null;

  if (isLoading) {
    return <div className="mt-20 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* ================= Author Card ================= */}
      <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6 mb-12">
        <img
          src={author?.avatar || "/profile.svg"}
          alt={author?.name}
          className="w-20 h-20 rounded-full object-cover"
        />

        <div>
          <h2 className="text-xl font-semibold">
            {author?.name}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <img
                    src="/book-icon.svg"
                    alt="book icon"
                    className="w-4 h-4"
                />
                <span>{books.length} books</span>
                </div>
            </div>
        </div>
      </div>

      {/* ================= Book List ================= */}
      <h1 className="text-2xl font-semibold mb-8">
        Book List
      </h1>

      {books.length === 0 ? (
        <div className="text-gray-500">
          No books found
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {books.map((book: any) => (
            <Link to={`/books/${book.id}`} key={book.id}>
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition overflow-hidden cursor-pointer">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-60 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-sm font-medium line-clamp-1">
                    {book.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {author?.name}
                  </p>

                  <div className="mt-2 text-sm text-yellow-500">
                    ⭐ {book.rating}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}