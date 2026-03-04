import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../app/hooks";
import { axiosInstance } from "../api/axios";

export default function Borrow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const { bookId, selectedBooks } = location.state || {};

  // ================= BOOK IDS =================
  const booksToFetch: number[] = useMemo(() => {
    if (selectedBooks?.length > 0) return selectedBooks;
    if (bookId) return [bookId];
    return [];
  }, [bookId, selectedBooks]);

  // ================= FETCH BOOKS =================
  const { data: books, isLoading } = useQuery({
    queryKey: ["borrow-books", booksToFetch],
    queryFn: async () => {
      const responses = await Promise.all(
        booksToFetch.map((id: number) =>
          axiosInstance.get(`/api/books/${id}`)
        )
      );
      return responses.map((res) => res.data.data);
    },
    enabled: booksToFetch.length > 0,
  });

  // ================= STATE =================
  const [duration, setDuration] = useState(3);
  const [borrowDate, setBorrowDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [agreedReturn, setAgreedReturn] = useState(false);
  const [agreedPolicy, setAgreedPolicy] = useState(false);

  const returnDate = dayjs(borrowDate).add(duration, "day");

  const handleConfirm = () => {
    if (!agreedReturn || !agreedPolicy) {
      alert("Please agree to the terms first.");
      return;
    }

    navigate("/borrow-success", {
      state: {
        returnDate: returnDate.format("DD MMMM YYYY"),
      },
    });
  };

  if (isLoading)
    return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-16 py-12">
      <h1 className="text-2xl font-semibold mb-12">
        Checkout
      </h1>

      <div className="grid md:grid-cols-3 gap-16">
        {/* ================= LEFT SIDE ================= */}
        <div className="md:col-span-2 space-y-12">
          {/* User Info */}
          <div>
            <h2 className="font-semibold mb-6 text-lg">
              User Information
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium">
                  {user?.name || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">
                  {user?.email || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Nomor Handphone
                </span>
                <span className="font-medium">
                  {user?.phone || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Book List */}
          <div>
            <h2 className="font-semibold mb-6 text-lg">
              Book List
            </h2>

            <div className="space-y-6">
              {books?.map((book: any) => (
                <div
                  key={book.id}
                  className="flex gap-6 items-start border-b pb-6"
                >
                  <img
                    src={
                      book.coverImage ||
                      "https://via.placeholder.com/80x110"
                    }
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-lg shadow-sm"
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

        {/* ================= RIGHT SIDE ================= */}
        <div className="bg-white rounded-2xl shadow-md p-8 h-fit">
          <h3 className="font-semibold mb-6">
            Complete Your Borrow Request
          </h3>

          {/* Borrow Date */}
          <div className="mb-6">
            <label className="text-sm text-gray-500">
                Borrow Date
            </label>

            <div className="mt-2">
                <input
                type="date"
                value={borrowDate}
                onChange={(e) =>
                    setBorrowDate(e.target.value)
                }
                className="w-full border rounded-lg px-4 py-3 text-sm"
                />
            </div>
            </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="text-sm text-gray-500">
              Borrow Duration
            </label>

            <div className="mt-3 space-y-2">
              {[3, 5, 10].map((d) => (
                <label
                  key={d}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    checked={duration === d}
                    onChange={() => setDuration(d)}
                  />
                  {d} Days
                </label>
              ))}
            </div>
          </div>

          {/* Return Date */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Return Date
            </p>
            <p className="text-red-500 font-medium mt-1">
              {returnDate.format("DD MMMM YYYY")}
            </p>
          </div>

          {/* Agreement */}
          <div className="space-y-3 mb-6">
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={agreedReturn}
                onChange={(e) =>
                  setAgreedReturn(e.target.checked)
                }
              />
              I agree to return the book(s) before the due date.
            </label>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={agreedPolicy}
                onChange={(e) =>
                  setAgreedPolicy(e.target.checked)
                }
              />
              I accept the library borrowing policy.
            </label>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium"
          >
            Confirm & Borrow
          </button>
        </div>
      </div>
    </div>
  );
}