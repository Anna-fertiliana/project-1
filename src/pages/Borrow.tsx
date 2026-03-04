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

  const booksToFetch: number[] = useMemo(() => {
    if (selectedBooks?.length > 0) return selectedBooks;
    if (bookId) return [bookId];
    return [];
  }, [bookId, selectedBooks]);

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

  const [duration, setDuration] = useState(3);
  const [borrowDate, setBorrowDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [agreedReturn, setAgreedReturn] = useState(false);
  const [agreedPolicy, setAgreedPolicy] = useState(false);

  const returnDate = dayjs(borrowDate).add(duration, "day");

  const handleConfirm = () => {
    if (!agreedReturn || !agreedPolicy) return;
    navigate("/borrow-success", {
      state: {
        returnDate: returnDate.format("DD MMMM YYYY"),
      },
    });
  };

  if (isLoading)
    return <div className="text-center mt-20 text-sm">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-xl sm:text-2xl font-semibold mb-8 sm:mb-12">
          Checkout
        </h1>

        <div className="grid gap-10 lg:grid-cols-3">

          {/* ================= LEFT ================= */}
          <div className="lg:col-span-2 space-y-10">

            {/* USER INFO */}
            <div>
              <h2 className="font-semibold mb-6 text-base sm:text-lg">
                User Information
              </h2>

              <div className="space-y-4 text-sm bg-white p-6 rounded-2xl shadow-sm">
                {[
                  { label: "Name", value: user?.name },
                  { label: "Email", value: user?.email },
                  { label: "Phone", value: user?.phone },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between"
                  >
                    <span className="text-gray-500">
                      {item.label}
                    </span>
                    <span className="font-medium text-right">
                      {item.value || "-"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* BOOK LIST */}
            <div>
              <h2 className="font-semibold mb-6 text-base sm:text-lg">
                Book List
              </h2>

              <div className="space-y-6">
                {books?.map((book: any) => (
                  <div
                    key={book.id}
                    className="bg-white p-6 rounded-2xl shadow-sm 
                               flex flex-col sm:flex-row gap-6"
                  >
                    <img
                      src={
                        book.coverImage ||
                        "https://via.placeholder.com/80x110"
                      }
                      alt={book.title}
                      className="w-24 h-32 sm:w-20 sm:h-28 object-cover rounded-lg mx-auto sm:mx-0"
                    />

                    <div className="flex-1 text-center sm:text-left">
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

          {/* ================= RIGHT ================= */}
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 h-fit lg:sticky lg:top-24">

            <h3 className="font-semibold mb-6">
              Complete Your Borrow Request
            </h3>

            {/* BORROW DATE */}
            <div className="mb-6">
              <label className="text-sm text-gray-500">
                Borrow Date
              </label>
              <input
                type="date"
                value={borrowDate}
                onChange={(e) =>
                  setBorrowDate(e.target.value)
                }
                className="mt-2 w-full border rounded-lg px-4 py-3 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* DURATION */}
            <div className="mb-6">
              <label className="text-sm text-gray-500">
                Borrow Duration
              </label>

              <div className="mt-3 space-y-3">
                {[3, 5, 10].map((d) => (
                  <label
                    key={d}
                    className="flex items-center gap-3 text-sm"
                  >
                    <input
                      type="radio"
                      checked={duration === d}
                      onChange={() => setDuration(d)}
                      className="w-4 h-4"
                    />
                    {d} Days
                  </label>
                ))}
              </div>
            </div>

            {/* RETURN DATE */}
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Return Date
              </p>
              <p className="text-red-500 font-medium mt-1">
                {returnDate.format("DD MMMM YYYY")}
              </p>
            </div>

            {/* AGREEMENT */}
            <div className="space-y-3 mb-6 text-sm">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreedReturn}
                  onChange={(e) =>
                    setAgreedReturn(e.target.checked)
                  }
                  className="w-4 h-4 mt-1"
                />
                I agree to return the book(s) before the due date.
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreedPolicy}
                  onChange={(e) =>
                    setAgreedPolicy(e.target.checked)
                  }
                  className="w-4 h-4 mt-1"
                />
                I accept the library borrowing policy.
              </label>
            </div>

            <button
              disabled={!agreedReturn || !agreedPolicy}
              onClick={handleConfirm}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium transition
                         disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirm & Borrow
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}