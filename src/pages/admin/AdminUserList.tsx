import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api/axios";
import dayjs from "dayjs";

export default function AdminUserList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, page],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/admin/users", {
        params: {
          search: search || undefined,
          page,
          limit,
        },
      });

      return res.data?.data;
    },
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">
            User Management
          </h2>

          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-72 border rounded-full px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">No</th>
                  <th className="px-6 py-4 text-left font-medium">Name</th>
                  <th className="px-6 py-4 text-left font-medium">Phone</th>
                  <th className="px-6 py-4 text-left font-medium">Email</th>
                  <th className="px-6 py-4 text-left font-medium">
                    Created At
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user: any, index: number) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        {(page - 1) * limit + index + 1}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {user.name}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {user.phone || "-"}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {user.email}
                      </td>

                      <td className="px-6 py-4 text-gray-400">
                        {dayjs(user.createdAt).format(
                          "DD MMM YYYY"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {pagination && (
          <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
            <span>
              Showing {(page - 1) * limit + 1}–
              {Math.min(page * limit, pagination.total)} of{" "}
              {pagination.total} users
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}