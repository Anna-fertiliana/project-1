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
    <div className="bg-gray-50 min-h-screen px-4 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
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

        {/* ================= MOBILE VIEW ================= */}
        <div className="space-y-3 sm:hidden">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500">No users found</p>
          ) : (
            users.map((user: any, index: number) => (
              <div
                key={user.id}
                className="bg-white rounded-xl p-4 shadow-sm space-y-1"
              >
                <p className="text-xs text-gray-400">
                  #{(page - 1) * limit + index + 1}
                </p>

                <p className="font-medium text-sm">
                  {user.name}
                </p>

                <p className="text-xs text-gray-500">
                  {user.email}
                </p>

                <p className="text-xs text-gray-500">
                  {user.phone || "-"}
                </p>

                <p className="text-[11px] text-gray-400">
                  {dayjs(user.createdAt).format("DD MMM YYYY")}
                </p>
              </div>
            ))
          )}
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden sm:block bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left">No</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">
                    Created At
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user: any, index: number) => (
                    <tr key={user.id} className="hover:bg-gray-50">
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

        {/* ================= PAGINATION ================= */}
        {pagination && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-6 text-sm text-gray-500">
            
            <span className="text-center sm:text-left">
              {(page - 1) * limit + 1}–
              {Math.min(page * limit, pagination.total)} of{" "}
              {pagination.total}
            </span>

            <div className="flex justify-center sm:justify-end gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
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