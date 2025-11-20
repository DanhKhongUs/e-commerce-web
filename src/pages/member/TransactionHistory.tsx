import { useEffect, useState } from "react";
import {
  faCircleCheck,
  faClock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getAllOrders } from "../../services/orderService";
import { IProduct } from "../../types";
interface ApiTransaction {
  order: {
    id: string;
    status: string;
    amount: number;
    products: IProduct;
    createdAt: string;
    method: string;
  };
  userId: string;
}

const statusConfig = {
  paid: {
    label: "Đã thanh toán",
    color: "bg-green-100 text-green-700",
    icon: <FontAwesomeIcon icon={faCircleCheck} />,
  },
  pending: {
    label: "Đang xử lý",
    color: "bg-yellow-100 text-yellow-700",
    icon: <FontAwesomeIcon icon={faClock} />,
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-700",
    icon: <FontAwesomeIcon icon={faXmark} />,
  },
};

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      const data = await getAllOrders();
      setTransactions(data);
      setIsLoading(false);
    };

    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto bg-white rounded-2xl p-8 ml-4 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Lịch sử giao dịch</h2>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl p-8 ml-4 shadow-md">
      <h2 className="text-2xl font-bold mb-6">Lịch sử giao dịch</h2>

      {transactions.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx, index) => {
            const { order } = tx;

            const statusKey =
              order.status.toLowerCase() as keyof typeof statusConfig;
            const status = statusConfig[statusKey];

            if (!status) {
              return (
                <motion.div
                  key={order.id}
                  className="flex items-center justify-between bg-gray-50 p-4"
                >
                  <p>Mã đơn: {order.id}</p>
                  <p className="text-red-500">
                    Trạng thái không xác định: {order.status}
                  </p>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl p-4"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    Mã đơn: {order.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ngày:{" "}
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                <div className="text-right flex flex-col items-end">
                  <p className="font-semibold text-lg text-gray-800">
                    {order.amount.toLocaleString("vi-VN")}₫
                  </p>
                  <div
                    className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full mt-1 ${status.color}`}
                  >
                    {status.icon}
                    {status.label}
                  </div>
                  <Link
                    to={`/account/transactionHistory/${order.id}`}
                    className="w-full flex justify-end mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
