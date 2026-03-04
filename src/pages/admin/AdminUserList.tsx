export default function AdminUserList() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User</h2>

      <input
        type="text"
        placeholder="Search user"
        className="w-full border rounded-full px-4 py-2 mb-6"
      />

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">No</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Created at</th>
            </tr>
          </thead>

          <tbody>
            {/* mapping data disini */}
          </tbody>
        </table>
      </div>
    </div>
  );
}