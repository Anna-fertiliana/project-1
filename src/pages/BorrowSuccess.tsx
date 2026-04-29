import { useLocation, useNavigate } from "react-router-dom";

export default function BorrowSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const { returnDate } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-md sm:p-8 sm:shadow-lg">
        {/* Success Icon */}
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 shadow-md sm:h-24 sm:w-24">
          <span className="text-3xl text-white sm:text-4xl">
            ✓
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-2 text-lg font-semibold sm:text-xl">
          Borrowing Successful!
        </h1>

        {/* Description */}
        <p className="mb-8 text-sm text-gray-600 sm:text-base">
          Your book has been successfully borrowed.
          {returnDate && (
            <>
              <br />
              Please return it by{" "}
              <span className="font-medium text-red-500">
                {returnDate}
              </span>
            </>
          )}
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/borrowed")}
            className="w-full rounded-full bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700 sm:text-base"
          >
            See Borrowed List
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full rounded-full border border-gray-300 py-3 text-sm transition hover:bg-gray-50 sm:text-base"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}