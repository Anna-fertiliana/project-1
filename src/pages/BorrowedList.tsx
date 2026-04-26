import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function BorrowedList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 6;

  const { data = [], isLoading } = useQuery({
    queryKey: ["my-loans", filter, page],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/loans/my", {
        params: {
          status:
            filter === "all"
              ? undefined
              : filter.toUpperCase(),
          page,
          limit,
        },
      });

      return res.data?.data?.loans || [];
    },
    placeholderData: (prev) => prev,
  });

  const returnMutation = useMutation({
    mutationFn: async (loanId: number) => {
      return axiosInstance.patch(`/api/loans/${loanId}/return`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-loans"],
      });
    },
  });

  const filteredLoans = data.filter((loan: any) =>
    loan.book?.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="text-center mt-20 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">
            Borrowed List
          </h2>

          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Home
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search borrowed books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["all", "borrowed", "returned", "overdue"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm border capitalize whitespace-nowrap transition ${
                filter === status
                  ? "bg-blue-100 text-blue-600 border-blue-200"
                  : "text-gray-500"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Empty */}
        {filteredLoans.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center text-sm text-gray-500 shadow-sm">
            No borrowed books found.
          </div>
        )}

        {/* Loan List */}
        <div className="space-y-6">
          {filteredLoans.map((loan: any) => {
            const isBorrowed = loan.status === "BORROWED";
            const isReturned = loan.status === "RETURNED";
            const isOverdue = loan.status === "OVERDUE";

            return (
              <div
                key={loan.id}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                {/* Status */}
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm gap-2 mb-4">
                  <div>
                    Status
                    <span
                      className={`ml-2 font-medium ${
                        isBorrowed
                          ? "text-green-500"
                          : isReturned
                          ? "text-gray-500"
                          : "text-red-500"
                      }`}
                    >
                      {loan.displayStatus}
                    </span>
                  </div>

                  <div>
                    Due Date
                    <span
                      className={`ml-2 font-medium ${
                        isOverdue
                          ? "text-red-500"
                          : "text-gray-700"
                      }`}
                    >
                      {dayjs(loan.dueAt).format("DD MMM YYYY")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col sm:flex-row gap-6 border-t pt-6">
                  <img
                    src={
                      loan.book?.coverImage ||
                      "https://via.placeholder.com/80x110"
                    }
                    alt={loan.book?.title}
                    className="w-24 h-32 sm:w-20 sm:h-28 object-cover rounded-lg mx-auto sm:mx-0"
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                      {loan.book?.category?.name}
                    </span>

                    <h3 className="font-medium mt-3">
                      {loan.book?.title}
                    </h3>

                    <p className="text-sm text-gray-500 mb-3">
                      {loan.book?.author?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {dayjs(loan.borrowedAt).format("DD MMM YYYY")} · Duration{" "}
                      {loan.durationDays} Days
                    </p>
                  </div>

                  {/* Action */}
                  <div className="flex flex-col gap-3 justify-center items-center sm:items-end">
                    {(isBorrowed || isOverdue) && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to return this book?"
                            )
                          ) {
                            returnMutation.mutate(loan.id);
                          }
                        }}
                        className="w-full sm:w-auto border border-red-500 text-red-500 hover:bg-red-50 px-5 py-2 rounded-full text-sm transition"
                      >
                        {returnMutation.isPending
                          ? "Returning..."
                          : "Return Book"}
                      </button>
                    )}

                    {isReturned && (
                      <button
                        onClick={() =>
                          navigate(`/reviews/create/${loan.book.id}`)
                        }
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm transition"
                      >
                        Give Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More */}
        {data.length === limit && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="border px-6 py-2 rounded-full text-sm text-gray-600 hover:bg-gray-100 transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}