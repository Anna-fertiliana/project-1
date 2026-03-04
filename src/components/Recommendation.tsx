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
    <section className="mt-16">
      <h2 className="text-2xl font-semibold mb-6">
        Recommendation
      </h2>

      {/* GRID 5 KOLOM */}
      <div className="grid grid-cols-5 gap-6">
        {allBooks.map((book: any) => (
          <Link to={`/books/${book.id}`} key={book.id}>
            <div
              className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition overflow-hidden cursor-pointer"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-72 object-cover"
              />

              <div className="p-4">
                <h3 className="text-sm font-medium">
                  {book.title}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  {book.author?.name || "Unknown"}
                </p>

                <div className="mt-2 text-sm">
                  ⭐ {book.rating || 4.9}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* LOAD MORE */}
      {hasNextPage && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-white transition"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}