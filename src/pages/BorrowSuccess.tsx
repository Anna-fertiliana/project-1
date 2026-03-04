import { useLocation, useNavigate } from "react-router-dom";

export default function BorrowSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const { returnDate } = location.state || {};

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
      <div className="text-center">

        {/* Circle Icon */}
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-white text-4xl">✓</span>
        </div>

        <h1 className="text-xl font-semibold mb-2">
          Borrowing Successful!
        </h1>

        <p className="text-gray-600 text-sm mb-8">
          Your book has been successfully borrowed.
          Please return it by{" "}
          <span className="text-red-500 font-medium">
            {returnDate}
          </span>
        </p>

        <button
          onClick={() => navigate("/borrowed")}
          className="px-8 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          See Borrowed List
        </button>

      </div>
    </div>
  );
}