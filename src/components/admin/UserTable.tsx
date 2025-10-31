import {
  faCheckCircle,
  faExclamationTriangle,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import Pagination from "../product/Pagination";

interface UserProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  created: string;
  avatar?: string;
  status: "Approved" | "Banned";
}

export default function UserTable() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<UserProps[]>(
    Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: "Nguyen Van A",
      email: "a@gmail.com",
      phone: "0123 456 789",
      created: "6 October, 2025",
      avatar:
        "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/396e9/MainBefore.jpg",
      status: i % 3 === 0 ? "Approved" : "Banned",
    }))
  );

  const ITEMS_PER_PAGE = 10;
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusColor = (status: UserProps["status"]) => {
    switch (status) {
      case "Approved":
        return "text-green-700 bg-green-100";
      case "Banned":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const updateStatus = (id: number, newStatus: UserProps["status"]) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex rounded-full w-96 border bg-white shadow-md mb-6">
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            if (!value.startsWith(" ")) setSearch(value);
          }}
          className="flex-1 px-6 py-2 text-sm sm:text-base bg-transparent text-[#333] placeholder-gray-500 focus:outline-none"
          placeholder="Search..."
        />
        <button className="w-12 sm:w-14 text-lg sm:text-xl border-l-1 rounded-r-full bg-gray-100 hover:bg-gray-50 text-gray-900 hover:text-gray-700 flex items-center justify-center transition cursor-pointer">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-left uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                TÊN
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                SỐ ĐIỆN THOẠI
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                NGÀY TẠO
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                TRẠNG THÁI
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                HÀNH ĐỘNG
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.created}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-default ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <button
                    onClick={() => updateStatus(user.id, "Approved")}
                    title="Phê duyệt người dùng"
                    className="hover:text-green-600 transition mr-3"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                  </button>

                  <button
                    onClick={() => updateStatus(user.id, "Banned")}
                    title="Khóa người dùng"
                    className="hover:text-red-600 transition mr-3"
                  >
                    <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />
                  </button>
                  <button
                    onClick={() =>
                      setUsers((prev) => prev.filter((u) => u.id !== user.id))
                    }
                    title="Xoá người dùng"
                    className="hover:text-gray-500 transition"
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-gray-600">
        <div>
          Hiển thị {paginated.length} / {filtered.length} người dùng
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
