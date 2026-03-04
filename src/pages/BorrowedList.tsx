import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import dayjs from "dayjs";

export default function BorrowedList() {
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  // ================= GET LOANS =================
  const { data, isLoading } = useQuery({
  queryKey: ["my-loans", filter, page],
  queryFn: async () => {
    const res = await axiosInstance.get("/api/loans/my", {
      params: {
        status: filter,
        page,
        limit,
      },
    });

    return res.data.data;
  },
  placeholderData: (previousData) => previousData,
    });

  const loans = data || [];

  // ================= RETURN MUTATION =================
  const returnMutation = useMutation({
    mutationFn: async (loanId: number) => {
      return axiosInstance.patch(`/api/loans/${loanId}/return`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-loans"] });
    },
  });

  // ================= FILTER SEARCH =================
  const filteredLoans = loans.filter((loan: any) =>
    loan.book?.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-16 py-10">
      <h2 className="text-lg font-semibold mb-6">
        Borrowed List
      </h2>

      {/* SEARCH */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search book"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[400px] border rounded-full px-4 py-2 text-sm"
        />
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-8">
        {["all", "active", "returned", "overdue"].map(
          (status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-sm border capitalize ${
                filter === status
                  ? "bg-blue-100 text-blue-600 border-blue-200"
                  : "text-gray-500"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* LOAN CARDS */}
      <div className="space-y-6 max-w-4xl">
        {filteredLoans.map((loan: any) => {
          const isOverdue =
            loan.status === "OVERDUE";

          return (
            <div
              key={loan.id}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              {/* TOP INFO */}
              <div className="flex justify-between text-sm mb-4">
                <div>
                  Status{" "}
                  <span
                    className={`ml-2 font-medium capitalize ${
                      loan.status === "ACTIVE"
                        ? "text-green-500"
                        : loan.status === "RETURNED"
                        ? "text-gray-500"
                        : "text-red-500"
                    }`}
                  >
                    {loan.status.toLowerCase()}
                  </span>
                </div>

                <div>
                  Due Date{" "}
                  <span
                    className={`ml-2 font-medium ${
                      isOverdue
                        ? "text-red-500"
                        : "text-gray-700"
                    }`}
                  >
                    {dayjs(loan.dueDate).format(
                      "DD MMM YYYY"
                    )}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex gap-6 border-t pt-6">
                {/* COVER */}
                <img
                  src={
                    loan.book?.coverImage ||
                    "https://via.placeholder.com/80x110"
                  }
                  alt={loan.book?.title}
                  className="w-20 h-28 object-cover rounded-lg"
                />

                {/* BOOK INFO */}
                <div className="flex-1">
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
                    {dayjs(
                      loan.borrowDate
                    ).format("DD MMM YYYY")}{" "}
                    · Duration {loan.duration} Days
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-3 justify-center items-end">
                  {/* RETURN BUTTON */}
                  {(loan.status === "ACTIVE" ||
                    loan.status === "OVERDUE") && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to return this book?"
                          )
                        ) {
                          returnMutation.mutate(
                            loan.id
                          );
                        }
                      }}
                      className="border border-red-500 text-red-500 hover:bg-red-50 px-5 py-2 rounded-full text-sm"
                    >
                      {returnMutation.isPending
                        ? "Returning..."
                        : "Return Book"}
                    </button>
                  )}

                  {/* GIVE REVIEW BUTTON */}
                  {loan.status === "RETURNED" && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm">
                      Give Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOAD MORE */}
      {loans.length === limit && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="border px-6 py-2 rounded-full text-sm text-gray-600 hover:bg-gray-100"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}