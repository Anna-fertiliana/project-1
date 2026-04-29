import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { Link } from "react-router-dom";

export default function Recommendation() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["books"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(
        `/api/books?page=${pageParam}&limit=10`
      );
      return response.data.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.books.length === 10) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  if (isLoading) {
    return (
      <div className="mt-8 text-center text-sm text-gray-500">
        Loading books...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-8 text-center text-sm text-red-500">
        Failed to load books
      </div>
    );
  }

  const allBooks =
    data?.pages.flatMap((page) => page.books) || [];

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-4 sm:text-xl sm:mb-6">
        Recommendation
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-6">
        {allBooks.map((book: any) => (
          <Link
            to={`/books/${book.id}`}
            key={book.id}
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition sm:hover:shadow-md sm:hover:-translate-y-1">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-40 object-cover sm:h-56 lg:h-64"
              />

              <div className="p-3 sm:p-4">
                <h3 className="text-sm font-medium line-clamp-1">
                  {book.title}
                </h3>

                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {book.author?.name || "Unknown"}
                </p>

                <div className="mt-2 text-xs text-yellow-500 sm:text-sm">
                  ⭐ {book.rating || 4.9}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-5 py-2.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50"
          >
            {isFetchingNextPage
              ? "Loading..."
              : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}