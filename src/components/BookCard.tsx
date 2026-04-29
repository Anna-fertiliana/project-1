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
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer">
        <div className="h-36 sm:h-48 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">
              No Image
            </span>
          )}
        </div>

        <h2 className="mt-3 text-sm font-semibold line-clamp-2 min-h-[40px]">
          {book.title || "Untitled"}
        </h2>

        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
          {book.author?.name || "Unknown Author"}
        </p>
      </div>
    </Link>
  );
}