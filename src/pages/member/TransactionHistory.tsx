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

interface OrderItemDetail {
  imageUrl: string;
  name: string;
}

interface ApiTransaction {
  id: string;
  status: string;
  amount: number;
  products: OrderItemDetail[];
  createdAt: string;
}

const statusConfig = {
  success: {
    label: "Đã thanh toán",
    color: "bg-green-100 text-green-700",
    icon: <FontAwesomeIcon icon={faCircleCheck} />,
  },
  pending: {
    label: "Đang xử lý",
    color: "bg-yellow-100 text-yellow-700",
    icon: <FontAwesomeIcon icon={faClock} />,
  },
  failed: {
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
      try {
        const data = await getAllOrders();

        const formatted = data.map((order: any) => ({
          id: order.id,
          createdAt: order.createdAt,
          status: order.status,
          amount: order.amount,
          products: order.products.map((p: any) => ({
            imageUrl: p.imageUrl,
            name: p.name,
          })),
        }));

        setTransactions(formatted);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
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
            const { id, status, amount, createdAt, products } = tx;

            const statusKey = status.toLowerCase() as keyof typeof statusConfig;
            const statusInfo = statusConfig[statusKey] || statusConfig.pending;
            const firstProduct = products[0];

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl p-4"
              >
                <div className="flex gap-8">
                  <img
                    src={firstProduct.imageUrl}
                    alt={firstProduct.name}
                    className="w-20 h-20 rounded-lg object-cover border"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {firstProduct.name}
                    </p>

                    <p className="text-gray-500">Mã đơn: {id}</p>
                    <p className="text-sm text-gray-500">
                      Ngày: {new Date(createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <p className="font-semibold text-lg text-gray-800">
                    {amount.toLocaleString("vi-VN")} VND
                  </p>
                  <div
                    className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full mt-1 ${statusInfo.color}`}
                  >
                    {statusInfo.icon}
                    {statusInfo.label}
                  </div>
                  <Link
                    to={`/account/transactionHistory/${id}`}
                    className="w-full flex justify-end mt-2 text-base text-blue-600 hover:underline"
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
