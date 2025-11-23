import { useState, useEffect } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import httpRequest from "../../utils/httpRequest";
import { toast } from "react-toastify";

interface UserProps {
  _id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  avatar?: string;
}

export default function UsersManage() {
  const [users, setUsers] = useState<UserProps[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      const res = await httpRequest("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa không")) return;

    try {
      await httpRequest.delete(`/admin/users/${id}`);
      await fetchUsers();
      toast.success("Đã xóa thành công");
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi xóa.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-left uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                TÊN
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                EMAIL
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                VAI TRÒ
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                NGÀY TẠO
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                HÀNH ĐỘNG
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2c-3.2 0-9.5 1.6-9.5 4.9V22h19v-3.1c0-3.3-6.3-4.9-9.5-4.9z" />
                  </svg>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  {new Date(user.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <button
                    onClick={() => handleDelete(user._id)}
                    title="Xoá người dùng"
                    className="hover:text-red-600 transition mr-3"
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
