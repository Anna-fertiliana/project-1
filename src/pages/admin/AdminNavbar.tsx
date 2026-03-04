import { useAppSelector } from "../../app/hooks";

export default function AdminNavbar() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex justify-between items-center px-8 py-4 border-b bg-white">
      {/* Logo */}
      <div className="text-lg font-semibold">Booky</div>

      {/* Admin Info */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
          {user?.name?.charAt(0)}
        </div>

        <span className="font-medium">
          {user?.name || "Admin"}
        </span>
      </div>
    </div>
  );
}