import { useLocation, useNavigate } from "react-router-dom";

export default function BorrowSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const { returnDate } = location.state || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md sm:shadow-lg p-8 text-center">

        {/* Circle Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-white text-3xl sm:text-4xl">✓</span>
        </div>

        <h1 className="text-lg sm:text-xl font-semibold mb-2">
          Borrowing Successful!
        </h1>

        <p className="text-gray-600 text-sm sm:text-base mb-8">
          Your book has been successfully borrowed.
          {returnDate && (
            <>
              <br />
              Please return it by{" "}
              <span className="text-red-500 font-medium">
                {returnDate}
              </span>
            </>
          )}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/borrowed")}
            className="w-full bg-blue-600 text-white py-2.5 rounded-full 
                       hover:bg-blue-700 transition font-medium"
          >
            See Borrowed List
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 py-2.5 rounded-full 
                       hover:bg-gray-100 transition text-sm"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}