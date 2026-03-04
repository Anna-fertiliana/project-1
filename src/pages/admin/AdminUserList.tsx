export default function AdminUserList() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">
            User Management
          </h2>

          <input
            type="text"
            placeholder="Search user..."
            className="w-full sm:w-72 border rounded-full px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Responsive Wrapper */}
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
                {/* Example Row */}
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">1</td>
                  <td className="px-6 py-4 font-medium">
                    John Doe
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    08123456789
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    john@email.com
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    01 Jan 2024
                  </td>
                </tr>

                {/* EMPTY STATE */}
                {/* Uncomment if no data */}
                {/*
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
                */}
              </tbody>
            </table>
          </div>

        </div>

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
          <span>Showing 1–10 of 100 users</span>

          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 transition">
              Prev
            </button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 transition">
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}