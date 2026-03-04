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
    return <div className="mt-10 text-center">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="mt-10 text-center text-red-500">
        Failed to load books
      </div>
    );
  }

  const allBooks = data?.pages.flatMap((page) => page.books) || [];

  return (
    <section className="mt-10 sm:mt-14 lg:mt-16">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        Recommendation
      </h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {allBooks.map((book: any) => (
          <Link to={`/books/${book.id}`} key={book.id}>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition overflow-hidden cursor-pointer">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-48 sm:h-60 lg:h-72 object-cover"
              />

              <div className="p-3 sm:p-4">
                <h3 className="text-sm font-medium line-clamp-1">
                  {book.title}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  {book.author?.name || "Unknown"}
                </p>

                <div className="mt-2 text-sm text-yellow-500">
                  ⭐ {book.rating || 4.9}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="flex justify-center mt-8 sm:mt-10">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-5 sm:px-6 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}