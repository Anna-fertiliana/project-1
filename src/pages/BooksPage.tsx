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
    return <p className="p-4">Loading...</p>;
  }

  if (isError) {
    return <p className="p-4">Error fetching books</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Book List
      </h1>

      {search && (
        <p className="mb-4 text-sm text-gray-500">
          Search result for: "{search}"
        </p>
      )}

      {filteredBooks.length === 0 ? (
        <p>No books found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
            />
          ))}
        </div>
      )}
    </div>
  );
}