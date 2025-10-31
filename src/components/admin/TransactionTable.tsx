import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useRef, useState } from "react";
import Pagination from "../product/Pagination";

interface TransactionProps {
  id: number;
  name: string;
  created: string;
  total: number;
  method: string;
  status: "Completed" | "Pending" | "Cancelled";
  action?: string;
}

const getStatusColor = (status: TransactionProps["status"]) => {
  switch (status) {
    case "Completed":
      return "text-green-600 bg-green-100";
    case "Pending":
      return "text-yellow-600 bg-yellow-100";
    case "Cancelled":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export default function TransactionTable() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filterStatus, setFilterStatus] = useState<
    "All" | TransactionProps["status"]
  >("All");

  const transactions: TransactionProps[] = Array.from(
    { length: 50 },
    (_, i) => ({
      id: i + 1,
      name: "Customer",
      created: "6 October, 2025",
      total: 200000,
      method: "Credit Card",
      status: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Pending" : "Cancelled",
      action: "View Details",
    })
  );

  const ITEMS_PER_PAGE = 10;
  const filtered = useMemo(() => {
    return transactions.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) &&
        (filterStatus === "All" || t.status === filterStatus)
    );
  }, [transactions, search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex gap-4 items-center">
        <div className="flex rounded-full w-96 border bg-white shadow-md mb-6">
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              if (!value.startsWith(" ")) setSearch(value);
            }}
            className="flex-1 px-6 py-2 text-base bg-transparent text-[#333] placeholder-gray-500 focus:outline-none"
            placeholder="Search..."
          />
          <button className="w-12 sm:w-14 text-lg sm:text-xl border-l-1 rounded-r-full bg-gray-100 hover:bg-gray-50 text-gray-900 hover:text-gray-700 flex items-center justify-center transition cursor-pointer">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className="border bg-white rounded-lg px-3 py-2 text-sm shadow-sm mb-6">
          <label htmlFor="status" className="font-medium ">
            Status:
          </label>
          <select
            id="status"
            name="status"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(
                e.target.value as "All" | TransactionProps["status"]
              );
            }}
            className="outline-none bg-transparent text-gray-800 font-medium cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-left uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                ID
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                NGƯỜI DÙNG
              </th>

              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                NGÀY
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                TỔNG
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                PHƯƠNG THỨC
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                TRẠNG THÁI
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                HÀNH ĐỘNG{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-gray-50 transition-colors font-medium"
              >
                <td className="px-6 py-5">{user.id}</td>
                <td className="px-6 py-5">{user.name}</td>

                <td className="px-6 py-5">{user.created}</td>
                <td className="px-6 py-5">
                  {user.total.toLocaleString("vi-VN")} VND
                </td>
                <td className="px-6 py-5">{user.method}</td>
                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-default ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {user.action}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-gray-600">
        <div>
          Hiển thị {paginated.length} / {filtered.length} giao dịch
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
