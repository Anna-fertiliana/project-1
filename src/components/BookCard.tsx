import { Link } from "react-router-dom";

interface BookCardProps {
  book: {
    id: number;
    title?: string;
    coverImage?: string;
    author?: {
      name?: string;
    };
  };
}

export default function BookCard({
  book,
}: BookCardProps) {
  return (
    <Link to={`/books/${book.id}`}>
      <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer bg-white">
        <div className="h-40 rounded mb-3 overflow-hidden bg-gray-100 flex items-center justify-center">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">
              No Image
            </span>
          )}
        </div>

        <h2 className="font-semibold text-sm line-clamp-2">
          {book.title || "Untitled"}
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          {book.author?.name || "Unknown Author"}
        </p>
      </div>
    </Link>
  );
}