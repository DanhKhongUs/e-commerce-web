import { useState, useEffect } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import httpRequest from "../../utils/httpRequest";
import { toast } from "react-toastify";

interface OrderItem {
  productId: string;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderProps {
  id: string;
  createdAt: string;
  status: string;
  products: OrderItem[];
  method: string;
  amount: number;
}

export default function OrdersManage() {
  const [orders, setOrders] = useState<OrderProps[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    try {
      const res = await httpRequest.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa không")) return;

    try {
      await httpRequest.delete(`/admin/order/${id}`);
      await fetchOrders();
      toast.success("Đã xóa thành công.");
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
                SẢN PHẨM
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                MÃ ĐƠN
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                TRẠNG THÁI
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                SỐ TIỀN
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-semibold">{order.id}</td>
                <td className="px-6 py-4">{order.status}</td>
                <td className="px-6 py-4">
                  {order.amount.toLocaleString("vi-VN")} VND
                </td>
                <td className="px-6 py-4">{order.method}</td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <button
                    onClick={() => handleDelete(order.id)}
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
