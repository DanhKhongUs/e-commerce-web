import { useState, useMemo, useRef } from "react";
import {
  faCheckCircle,
  faExclamationTriangle,
  faTrash,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../product/Pagination";

interface PostProps {
  id: number;
  title: string;
  author: string;
  category: string;
  created: string;
  status: "Pending" | "Approved" | "Spam" | "Verified";
}

export default function PostsTable() {
  const [posts, setPosts] = useState<PostProps[]>(
    Array.from({ length: 35 }, (_, i) => ({
      id: i + 1,
      title: `Bài viết ${i + 1}`,
      author: `Tác giả ${i + 1}`,
      category: i % 3 === 0 ? "Tin tức" : i % 3 === 1 ? "Giáo dục" : "Sức khỏe",
      created: "14 October 2025",
      status:
        i % 4 === 0
          ? "Pending"
          : i % 4 === 1
          ? "Approved"
          : i % 4 === 2
          ? "Spam"
          : "Verified",
    }))
  );

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | PostProps["status"]>(
    "All"
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filtered = useMemo(() => {
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) &&
        (filterStatus === "All" || p.status === filterStatus)
    );
  }, [posts, search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusColor = (status: PostProps["status"]) => {
    switch (status) {
      case "Approved":
        return "text-green-700 bg-green-100";
      case "Pending":
        return "text-yellow-700 bg-yellow-100";
      case "Spam":
        return "text-red-700 bg-red-100";
      case "Verified":
        return "text-blue-700 bg-blue-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const updateStatus = (id: number, newStatus: PostProps["status"]) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex gap-4 mb-6">
        <div className="flex rounded-full w-96 border bg-white shadow-md">
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

        <select
          className="border bg-white rounded-lg px-3 py-2 text-sm shadow-sm text-gray-800 font-medium cursor-pointer"
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as "All" | PostProps["status"])
          }
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Spam">Spam</option>
          <option value="Verified">Verified</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-left uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                ID
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                Tiêu đề
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                Tác giả
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                Danh mục
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((post) => (
              <tr
                key={post.id}
                className="border-t hover:bg-gray-50 transition-colors font-medium"
              >
                <td className="px-6 py-5">{post.id}</td>
                <td className="px-6 py-5 font-medium text-gray-900">
                  {post.title}
                </td>
                <td className="px-6 py-5">{post.author}</td>
                <td className="px-6 py-5">{post.category}</td>
                <td className="px-6 py-5">{post.created}</td>
                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-default ${getStatusColor(
                      post.status
                    )}`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <button
                    onClick={() => updateStatus(post.id, "Approved")}
                    title="Phê duyệt bài viết"
                    className="hover:text-green-600 transition mr-3"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                  </button>

                  <button
                    onClick={() => updateStatus(post.id, "Spam")}
                    title="Đánh dấu là spam"
                    className="hover:text-red-600 transition mr-3"
                  >
                    <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />
                  </button>

                  <button
                    onClick={() => updateStatus(post.id, "Verified")}
                    title="Gắn nhãn Đã kiểm định"
                    className="hover:text-blue-600 transition"
                  ></button>

                  <button
                    onClick={() =>
                      setPosts((prev) => prev.filter((p) => p.id !== post.id))
                    }
                    title="Xoá bài viết"
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
      <div className="flex justify-between items-center mt-4 text-gray-600">
        <div>
          Hiển thị {paginated.length} / {filtered.length} bài viết
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
