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

  const { user } = useAppSelector((state) => state.auth);

  const { bookId, selectedBooks } = location.state || {};

  const [duration, setDuration] = useState(3);
  const [borrowDate, setBorrowDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [agreedReturn, setAgreedReturn] = useState(false);
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const booksToFetch: number[] = useMemo(() => {
    if (Array.isArray(selectedBooks) && selectedBooks.length > 0) {
      return selectedBooks;
    }

    if (bookId) return [bookId];

    return [];
  }, [bookId, selectedBooks]);

  const returnDate = dayjs(borrowDate).add(duration, "day");

  const { data: books = [], isLoading, isError } = useQuery<Book[]>({
    queryKey: ["borrow-books", booksToFetch],
    queryFn: async () => {
      const responses = await Promise.all(
        booksToFetch.map((id) =>
          axiosInstance.get(`/api/books/${id}`)
        )
      );

      return responses.map((res) => res.data.data);
    },
    enabled: booksToFetch.length > 0,
  });

  const borrowMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/api/loans", {
        bookId: booksToFetch[0],
        borrowDate,
        duration,
      });

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["borrowed-books"] });

      navigate("/borrow-success", {
        state: {
          returnDate: returnDate.format("DD MMMM YYYY"),
        },
      });
    },

    onError: (error: any) => {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to borrow books. Please try again."
      );
    },
  });

  const handleConfirm = () => {
    if (!agreedReturn || !agreedPolicy) return;
    setErrorMessage("");
    borrowMutation.mutate();
  };

  if (isLoading) {
    return <div className="mt-20 text-center text-sm">Loading...</div>;
  }

  if (isError || booksToFetch.length === 0) {
    return (
      <div className="mt-20 text-center text-sm text-red-500">
        Failed to load book data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-lg font-semibold md:text-2xl">
          Checkout
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">
            {/* User */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold">
                User Information
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span>{user?.name || "-"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span>{user?.email || "-"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span>{user?.phone || "-"}</span>
                </div>
              </div>
            </div>

            {/* Books */}
            <div>
              <h2 className="mb-4 font-semibold">Book List</h2>

              <div className="space-y-4">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm"
                  >
                    <img
                      src={
                        book.coverImage ||
                        "https://via.placeholder.com/80x110"
                      }
                      alt={book.title}
                      className="h-28 w-20 rounded-lg object-cover"
                    />

                    <div className="min-w-0">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                        {book.category?.name}
                      </span>

                      <h3 className="mt-3 font-medium line-clamp-2">
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

          {/* RIGHT */}
          <div className="h-fit rounded-2xl bg-white p-5 shadow-md">
            <h3 className="mb-5 font-semibold">
              Complete Your Borrow Request
            </h3>

            <div className="mb-5">
              <label className="text-sm text-gray-500">
                Borrow Date
              </label>
              <input
                type="date"
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
                className="mt-2 w-full rounded-lg border px-4 py-3 text-sm"
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
                      checked={duration === day}
                      onChange={() => setDuration(day)}
                    />
                    {day} Days
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-sm text-gray-500">
                Return Date
              </p>
              <p className="mt-1 font-medium text-red-500">
                {returnDate.format("DD MMMM YYYY")}
              </p>
            </div>

            <div className="mb-4 space-y-3 text-sm">
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={agreedReturn}
                  onChange={(e) =>
                    setAgreedReturn(e.target.checked)
                  }
                />
                I agree to return the book(s).
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={agreedPolicy}
                  onChange={(e) =>
                    setAgreedPolicy(e.target.checked)
                  }
                />
                I accept the borrowing policy.
              </label>
            </div>

            {errorMessage && (
              <p className="mb-4 text-sm text-red-500">
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
              className="w-full rounded-full bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:bg-gray-300"
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