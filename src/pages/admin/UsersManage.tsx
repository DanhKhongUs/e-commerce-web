import { useState, useEffect } from "react";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
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
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;

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
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6 mt-1">
        <h2 className="text-2xl font-semibold">
          Danh sách người dùng ({users.length})
        </h2>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <div className="max-h-[706px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 sticky top-0 z-10 border-b">
              <tr className="text-gray-700 text-sm uppercase tracking-wide">
                <th className="p-4">Người dùng</th>
                <th className="p-4">Email</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4">Ngày tạo</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-gray-700">{user.email}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-md font-medium 
                      ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4 text-gray-700">
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-400 transition"
                      title="Xóa người dùng"
                    >
                      <FontAwesomeIcon icon={faTrashCan} size="lg" />
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    Không có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
