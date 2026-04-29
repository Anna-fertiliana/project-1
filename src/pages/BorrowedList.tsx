import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 px-4 py-5 sm:px-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* TITLE */}
        <h2 className="text-xl font-semibold mb-5">
          Borrowed List
        </h2>

        {/* SEARCH */}
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search book"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border rounded-full pl-10 pr-4 py-2 text-sm bg-white"
          />
        </div>

        {/* FILTER */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
          {[
            "all",
            "borrowed",
            "returned",
            "overdue",
          ].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs border whitespace-nowrap capitalize transition ${
                filter === status
                  ? "bg-blue-50 text-blue-600 border-blue-300"
                  : "bg-white text-gray-500"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* EMPTY */}
        {filteredLoans.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center text-sm text-gray-500 shadow-sm">
            No borrowed books found.
          </div>
        )}

        {/* LIST */}
        <div className="space-y-4">
          {filteredLoans.map((loan: any) => {
            const isBorrowed =
              loan.status === "BORROWED";
            const isReturned =
              loan.status === "RETURNED";
            const isOverdue =
              loan.status === "OVERDUE";

            return (
              <div
                key={loan.id}
                className="bg-white rounded-2xl border p-4 shadow-sm"
              >
                {/* top info */}
                <div className="flex justify-between text-[11px] mb-3">
                  <div>
                    <span className="text-gray-500">
                      Status
                    </span>
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
                    <span className="text-gray-500">
                      Due Date
                    </span>
                    <span
                      className={`ml-2 font-medium ${
                        isOverdue
                          ? "text-red-500"
                          : "text-pink-500"
                      }`}
                    >
                      {dayjs(loan.dueAt).format(
                        "DD MMM YYYY"
                      )}
                    </span>
                  </div>
                </div>

                {/* content */}
                <div className="flex gap-3">
                  <img
                    src={
                      loan.book?.coverImage ||
                      "https://via.placeholder.com/80x110"
                    }
                    alt={loan.book?.title}
                    className="w-16 h-24 rounded-lg object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[10px] bg-gray-100 px-2 py-1 rounded-full">
                      {loan.book?.category?.name ||
                        "Category"}
                    </span>

                    <h3 className="font-medium text-sm mt-2 truncate">
                      {loan.book?.title}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {loan.book?.author?.name}
                    </p>

                    <p className="text-[11px] text-gray-500 mt-2">
                      {dayjs(
                        loan.borrowedAt
                      ).format("DD MMM YYYY")}{" "}
                      · Duration {loan.durationDays} Days
                    </p>
                  </div>
                </div>

                {/* action */}
                <div className="mt-4">
                  {(isBorrowed || isOverdue) && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Return this book?"
                          )
                        ) {
                          returnMutation.mutate(
                            loan.id
                          );
                        }
                      }}
                      className="w-full border border-red-500 text-red-500 py-2 rounded-full text-sm"
                    >
                      {returnMutation.isPending
                        ? "Returning..."
                        : "Return Book"}
                    </button>
                  )}

                  {isReturned && (
                    <button
                      onClick={() =>
                        navigate(
                          `/reviews/create/${loan.book.id}`
                        )
                      }
                      className="w-full bg-blue-600 text-white py-2 rounded-full text-sm"
                    >
                      Give Review
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* LOAD MORE */}
        {data.length === limit && (
          <div className="mt-8 text-center">
            <button
              onClick={() =>
                setPage((prev) => prev + 1)
              }
              className="px-6 py-2 border rounded-full text-sm"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}