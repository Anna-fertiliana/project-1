import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import BookCard from "../components/BookCard";

interface Book {
  id: number;
  title?: string;
  coverImage?: string;
}

export default function BooksPage() {
  const [params] = useSearchParams();
  const search = params.get("search") || "";

  const {
    data: books = [],
    isLoading,
    isError,
  } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/books");
      return response.data?.data?.books || [];
    },
  });

  const filteredBooks = books.filter((book) =>
    (book.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="px-4 py-10 text-center text-sm text-gray-500">
        Loading books...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-10 text-center text-sm text-red-500">
        Failed to fetch books.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-lg sm:text-2xl font-semibold mb-4">
          Book List
        </h1>

        {search && (
          <p className="mb-5 text-sm text-gray-500">
            Search result for:
            <span className="font-medium text-gray-700">
              {" "}
              "{search}"
            </span>
          </p>
        )}

        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-sm text-gray-500 shadow-sm">
            No books found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}