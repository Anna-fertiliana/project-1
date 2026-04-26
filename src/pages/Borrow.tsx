import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAppSelector } from "../app/hooks";
import { axiosInstance } from "../api/axios";

interface Book {
  id: number;
  title: string;
  coverImage?: string;
  category?: {
    name: string;
  };
  author?: {
    name: string;
  };
}

export default function Borrow() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { user } = useAppSelector(
    (state) => state.auth
  );

  const { bookId, selectedBooks } =
    location.state || {};

  const [duration, setDuration] = useState(3);
  const [borrowDate, setBorrowDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [agreedReturn, setAgreedReturn] =
    useState(false);
  const [agreedPolicy, setAgreedPolicy] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const booksToFetch: number[] = useMemo(() => {
    if (
      Array.isArray(selectedBooks) &&
      selectedBooks.length > 0
    ) {
      return selectedBooks;
    }

    if (bookId) {
      return [bookId];
    }

    return [];
  }, [bookId, selectedBooks]);

  const returnDate = dayjs(borrowDate).add(
    duration,
    "day"
  );

  const {
    data: books = [],
    isLoading,
    isError,
  } = useQuery<Book[]>({
    queryKey: ["borrow-books", booksToFetch],
    queryFn: async () => {
      const responses = await Promise.all(
        booksToFetch.map((id) =>
          axiosInstance.get(`/api/books/${id}`)
        )
      );

      return responses.map(
        (res) => res.data.data
      );
    },
    enabled: booksToFetch.length > 0,
  });

  const borrowMutation = useMutation({
    mutationFn: async () => {
      if (!booksToFetch.length) {
        throw new Error("No book selected");
      }

      const response =
        await axiosInstance.post("/api/loans", {
          bookId: booksToFetch[0],
          borrowDate,
          duration,
        });

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["borrowed-books"],
      });

      queryClient.invalidateQueries({
        queryKey: ["books"],
      });

      navigate("/borrow-success", {
        state: {
          returnDate:
            returnDate.format(
              "DD MMMM YYYY"
            ),
        },
      });
    },

    onError: (error: any) => {
      console.error(
        "Borrow error:",
        error.response?.data
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to borrow books. Please try again."
      );
    },
  });

  const handleConfirm = () => {
    if (!agreedReturn || !agreedPolicy) {
      return;
    }

    setErrorMessage("");
    borrowMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="text-center mt-20 text-sm">
        Loading...
      </div>
    );
  }

  if (isError || booksToFetch.length === 0) {
    return (
      <div className="text-center mt-20 text-sm text-red-500">
        Failed to load book data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold mb-8">
          Checkout
        </h1>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="font-semibold mb-4">
                User Information
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Name
                  </span>
                  <span>{user?.name || "-"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Email
                  </span>
                  <span>{user?.email || "-"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Phone
                  </span>
                  <span>{user?.phone || "-"}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-4">
                Book List
              </h2>

              <div className="space-y-4">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white p-5 rounded-2xl shadow-sm flex gap-4"
                  >
                    <img
                      src={
                        book.coverImage ||
                        "https://via.placeholder.com/80x110"
                      }
                      alt={book.title}
                      className="w-20 h-28 object-cover rounded-lg"
                    />

                    <div>
                      <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                        {book.category?.name}
                      </span>

                      <h3 className="font-medium mt-3">
                        {book.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {book.author?.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 h-fit">
            <h3 className="font-semibold mb-6">
              Complete Your Borrow Request
            </h3>

            <div className="mb-5">
              <label className="text-sm text-gray-500">
                Borrow Date
              </label>

              <input
                type="date"
                value={borrowDate}
                onChange={(e) =>
                  setBorrowDate(
                    e.target.value
                  )
                }
                className="mt-2 w-full border rounded-lg px-4 py-3 text-sm"
              />
            </div>

            <div className="mb-5">
              <label className="text-sm text-gray-500">
                Borrow Duration
              </label>

              <div className="mt-3 space-y-2">
                {[3, 5, 10].map((day) => (
                  <label
                    key={day}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      checked={
                        duration === day
                      }
                      onChange={() =>
                        setDuration(day)
                      }
                    />
                    {day} Days
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Return Date
              </p>
              <p className="text-red-500 font-medium mt-1">
                {returnDate.format(
                  "DD MMMM YYYY"
                )}
              </p>
            </div>

            <div className="space-y-3 mb-4 text-sm">
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={agreedReturn}
                  onChange={(e) =>
                    setAgreedReturn(
                      e.target.checked
                    )
                  }
                />
                I agree to return the book(s).
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={agreedPolicy}
                  onChange={(e) =>
                    setAgreedPolicy(
                      e.target.checked
                    )
                  }
                />
                I accept the borrowing policy.
              </label>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500 mb-4">
                {errorMessage}
              </p>
            )}

            <button
              onClick={handleConfirm}
              disabled={
                !agreedReturn ||
                !agreedPolicy ||
                borrowMutation.isPending
              }
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 disabled:bg-gray-300"
            >
              {borrowMutation.isPending
                ? "Processing..."
                : "Confirm & Borrow"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}