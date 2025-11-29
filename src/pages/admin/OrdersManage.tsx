import { useState, useEffect, useRef } from "react";
import { faChevronDown, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import httpRequest from "../../utils/httpRequest";
import { toast } from "react-toastify";

interface UserItem {
  email: string;
  fullName: string;
  avatar?: string;
}

interface OrderProps {
  id: string;
  user: UserItem | null;
  createdAt: string;
  status: string;
  method: string;
  amount: number;
}

export default function OrdersManage() {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await httpRequest.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await httpRequest.put(`/admin/orders/${id}`, { status: newStatus });
      await fetchOrders();
      toast.success("Đã cập nhật thành công");
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi cập nhật.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;

    try {
      await httpRequest.delete(`/admin/orders/${id}`);
      await fetchOrders();
      toast.success("Đã xóa thành công.");
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi xóa.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6">
        Danh sách đơn hàng ({orders.length})
      </h2>

      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <div className="max-h-[706px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 sticky top-0 z-10 border-b">
              <tr className="text-gray-700 text-sm uppercase tracking-wide">
                <th className="p-4">Người mua</th>
                <th className="p-4">Mã đơn</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Số tiền</th>
                <th className="p-4">Phương thức</th>
                <th className="p-4">Ngày mua</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="p-4 w-[320px]">
                    <div className="flex items-center gap-3">
                      {order.user?.avatar ? (
                        <img
                          src={order.user.avatar}
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                          {order.user?.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-gray-800">
                          {order.user?.fullName}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {order.user?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{order.id}</td>
                  <td className="p-4 relative">
                    <span
                      onClick={() => setOpenDropdown(order.id)}
                      className={`px-3 py-1 text-sm rounded-md font-medium shadow-sm cursor-pointer transition-all inline-block select-none
                        ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : order.status === "success"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : order.status === "failed"
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }
                        `}
                    >
                      {order.status} <FontAwesomeIcon icon={faChevronDown} />
                    </span>

                    {openDropdown === order.id && (
                      <div
                        ref={dropdownRef}
                        className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20"
                      >
                        {["pending", "success", "failed"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              handleUpdateStatus(order.id, status);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-100${
                              order.status === status
                                ? "bg-gray-100 font-semibold"
                                : ""
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-semibold text-gray-700">
                    {order.amount.toLocaleString("vi-VN")} VND
                  </td>
                  <td className="p-5 text-gray-700">{order.method}</td>
                  <td className="p-4 text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-500 hover:text-red-400 transition"
                      title="Xóa đơn hàng"
                    >
                      <FontAwesomeIcon icon={faTrashCan} size="lg" />
                    </button>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    Không có đơn hàng nào.
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
