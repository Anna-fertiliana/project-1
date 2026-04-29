import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../../api/axios";
import dayjs from "dayjs";

export default function AdminBorrowedList() {
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-loans", filter],
    queryFn: async () => {
      const statusMap: Record<string, string | undefined> = {
        all: undefined,
        borrowed: "ACTIVE",
        returned: "RETURNED",
        overdue: "OVERDUE",
      };

      const res = await axiosInstance.get("/api/admin/loans", {
        params: {
          status: statusMap[filter],
        },
      });

      return res.data?.data?.loans || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (loanId: number) => {
      return axiosInstance.patch(`/api/admin/loans/${loanId}`, {
        status: "RETURNED",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-loans"],
      });
    },
  });

  const filteredLoans = data.filter((loan: any) => {
    const keyword = search.toLowerCase();

    return (
      loan.book?.title?.toLowerCase().includes(keyword) ||
      loan.user?.name?.toLowerCase().includes(keyword)
    );
  });

  if (isLoading) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-xl font-semibold mb-6">
        Borrowed List
      </h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {["all", "borrowed", "returned", "overdue"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs capitalize transition ${
              filter === status
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {status === "borrowed" ? "Active" : status}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredLoans.map((loan: any) => {
          const isActive = loan.status === "ACTIVE";
          const isReturned = loan.status === "RETURNED";
          const isOverdue = loan.status === "OVERDUE";

          return (
            <div
              key={loan.id}
              className="bg-white rounded-2xl border p-4 shadow-sm"
            >
              {/* Status */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-xs mb-4">
                <div>
                  Status{" "}
                  <span
                    className={`font-medium ${
                      isActive
                        ? "text-green-500"
                        : isReturned
                        ? "text-gray-400"
                        : "text-red-500"
                    }`}
                  >
                    {loan.displayStatus}
                  </span>
                </div>

                <div>
                  Due Date{" "}
                  <span
                    className={`font-medium ${
                      isOverdue
                        ? "text-red-500"
                        : "text-pink-500"
                    }`}
                  >
                    {dayjs(loan.dueAt).format("DD MMM YYYY")}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col sm:flex-row gap-4 border-t pt-4">
                <img
                  src={
                    loan.book?.coverImage ||
                    "/book-placeholder.png"
                  }
                  alt={loan.book?.title}
                  className="w-20 h-28 object-cover rounded-lg mx-auto sm:mx-0"
                />

                <div className="flex-1">
                  <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full">
                    {loan.book?.category?.name}
                  </span>

                  <h3 className="mt-2 text-sm font-medium">
                    {loan.book?.title}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {loan.book?.author?.name}
                  </p>

                  <p className="mt-2 text-[11px] text-gray-400">
                    {dayjs(loan.borrowedAt).format("DD MMM YYYY")} ·
                    Duration {loan.durationDays} Days
                  </p>

                  <div className="mt-4">
                    <p className="text-[11px] text-gray-400">
                      Borrower's name
                    </p>
                    <p className="text-sm font-medium">
                      {loan.user?.name}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <div className="sm:self-end">
                    <button
                      onClick={() =>
                        updateMutation.mutate(loan.id)
                      }
                      className="w-full sm:w-auto px-4 py-2 text-xs rounded-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {updateMutation.isPending
                        ? "Updating..."
                        : "Mark Returned"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredLoans.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-400">
            No borrowed data found
          </div>
        )}
      </div>
    </div>
  );
}