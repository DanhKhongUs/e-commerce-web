import { useState, useEffect } from "react";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
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
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;

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
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6">
        Danh sách đơn hàng ({orders.length})
      </h2>

      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <div className="max-h-[706px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 sticky top-0 z-10 border-b">
              <tr className="text-gray-700 text-sm uppercase tracking-wide">
                <th className="p-4">Sản phẩm</th>
                <th className="p-4">Mã đơn</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Số tiền</th>
                <th className="p-4">Phương thức</th>
                <th className="p-4">Ngày tạo</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.products[0]?.imageUrl}
                        alt={order.products[0]?.name}
                        className="w-12 h-12 rounded-md object-cover border"
                      />

                      <div>
                        <p className="font-semibold text-gray-800">
                          {order.products[0]?.name}
                        </p>

                        {order.products.length > 1 && (
                          <p className="text-gray-500 text-sm">
                            ...và {order.products.length - 1} sản phẩm khác
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-gray-700">{order.id}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-md font-medium ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : order.status === "success"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.status}
                    </span>
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
