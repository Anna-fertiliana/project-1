import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import dayjs from "dayjs";
import { useAppSelector } from "../app/hooks";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, viewMode } = useAppSelector(
    (state) => state.auth
  );

  const isAdminPreview =
    user?.role === "ADMIN" &&
    viewMode === "USER";

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/books/${id}`
      );
      return res.data.data;
    },
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/api/cart", {
        bookId: book.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      alert("Book added to cart");
    },
  });

  const handleBorrow = () => {
    if (isAdminPreview) {
      alert(
        "Admin cannot borrow books while using View as User."
      );
      return;
    }

    navigate("/borrow", {
      state: { bookId: book.id },
    });
  };

  const handleAddToCart = () => {
    if (isAdminPreview) {
      alert(
        "Admin cannot add books to cart while using View as User."
      );
      return;
    }

    addToCartMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 text-sm">
        Loading...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20 text-sm">
        Book not found
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 flex flex-wrap gap-2 mb-5">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>&gt;</span>
          <Link to="/category" className="hover:text-blue-600">
            Category
          </Link>
          <span>&gt;</span>
          <span className="text-gray-700">
            {book.title}
          </span>
        </div>

        {/* Main */}
        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          {/* Image */}
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-sm"
          />

          {/* Info */}
          <div>
            <h1 className="text-xl sm:text-3xl font-semibold">
              {book.title}
            </h1>

            <Link
              to={`/authors/${book.author?.id}`}
              className="text-gray-500 mt-2 inline-block hover:text-blue-600 hover:underline text-sm"
            >
              {book.author?.name}
            </Link>

            <div className="mt-3 text-sm">
              ⭐ {book.rating ?? 0} (
              {book.reviewCount ?? 0} reviews)
            </div>

            <p className="mt-5 text-gray-600 text-sm leading-relaxed">
              {book.description}
            </p>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                className="flex-1 py-3 border rounded-full text-sm hover:bg-gray-100 disabled:opacity-50"
              >
                {addToCartMutation.isPending
                  ? "Adding..."
                  : "Add to Cart"}
              </button>

              <button
                onClick={handleBorrow}
                className="flex-1 py-3 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700"
              >
                Borrow
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {Array.isArray(book.reviews) &&
          book.reviews.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg sm:text-2xl font-semibold mb-5">
                Reviews
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {book.reviews.map(
                  (review: any) => (
                    <div
                      key={review.id}
                      className="bg-white p-4 rounded-2xl shadow-sm border"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src="/profile.svg"
                          alt="Reviewer"
                          className="w-8 h-8 rounded-full"
                        />

                        <div>
                          <p className="text-sm font-medium">
                            {review.user?.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {dayjs(
                              review.createdAt
                            ).format(
                              "DD MMM YYYY"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 text-yellow-500 text-sm">
                        ⭐ {review.rating}
                      </div>

                      <p className="text-sm text-gray-600 mt-2">
                        {review.comment}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}