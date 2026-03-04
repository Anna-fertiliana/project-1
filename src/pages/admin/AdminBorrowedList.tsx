import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api/axios";

export default function AdminBorrowedList() {
  const { data } = useQuery({
    queryKey: ["admin-borrowed"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/admin/borrowed");
      return res.data;
    },
  });

  const borrowedData = data?.data || [];

  return (
    <div className="space-y-6">
      {/* ===== Title ===== */}
      <h1 className="text-xl font-semibold">Borrowed List</h1>

      {/* ===== Search ===== */}
      <div>
        <input
          type="text"
          placeholder="Search user or book..."
          className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ===== Table ===== */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">No</th>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Book</th>
              <th className="px-6 py-3 text-left">Borrow Date</th>
              <th className="px-6 py-3 text-left">Return Date</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {borrowedData.map((item: any, index: number) => (
              <tr key={item.id} className="border-t">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{item.user?.name}</td>
                <td className="px-6 py-4">{item.book?.title}</td>
                <td className="px-6 py-4">{item.borrowDate}</td>
                <td className="px-6 py-4">{item.returnDate || "-"}</td>

                {/* ===== Status ===== */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "BORROWED"
                        ? "bg-yellow-100 text-yellow-600"
                        : item.status === "RETURNED"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* ===== Action ===== */}
                <td className="px-6 py-4 space-x-2">
                  {item.status === "BORROWED" && (
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700">
                      Mark Returned
                    </button>
                  )}

                  <button className="px-3 py-1 text-xs border rounded-full hover:bg-gray-100">
                    Detail
                  </button>
                </td>
              </tr>
            ))}

            {borrowedData.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-gray-400"
                >
                  No borrowed data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}