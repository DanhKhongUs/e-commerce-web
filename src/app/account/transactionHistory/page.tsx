import {
  faCircleCheck,
  faClock,
  faRotate,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
type Transaction = {
  id: string;
  date: string;
  productImg: string;
  productName: string;
  total: number;
  status: "paid" | "pending" | "cancelled" | "refunded";
};

const transactions: Transaction[] = [
  {
    id: "ORD-20251005-001",
    date: "05/10/2025",
    productImg: "/landing/hero1.png",
    productName: "Áo thun unisex Cotton Premium",
    total: 299000,
    status: "paid",
  },
  {
    id: "ORD-20251004-002",
    date: "04/10/2025",
    productImg: "/landing/hero2.png",
    productName: "Giày Sneaker trắng năng động",
    total: 650000,
    status: "pending",
  },
  {
    id: "ORD-20251001-003",
    date: "01/10/2025",
    productImg: "/landing/hero3.png",
    productName: "Túi xách thời trang nữ",
    total: 450000,
    status: "cancelled",
  },
  {
    id: "ORD-20250928-004",
    date: "28/09/2025",
    productImg: "/landing/hero4.png",
    productName: "Tai nghe Bluetooth Pro",
    total: 899000,
    status: "refunded",
  },
  {
    id: "ORD-20250928-005",
    date: "28/09/2025",
    productImg: "/landing/hero4.png",
    productName: "Tai nghe Bluetooth Pro",
    total: 899000,
    status: "refunded",
  },
  {
    id: "ORD-20250928-006",
    date: "28/09/2025",
    productImg: "/landing/hero4.png",
    productName: "Tai nghe Bluetooth Pro",
    total: 899000,
    status: "refunded",
  },
  {
    id: "ORD-20250928-007",
    date: "28/09/2025",
    productImg: "/landing/hero4.png",
    productName: "Tai nghe Bluetooth Pro",
    total: 899000,
    status: "refunded",
  },
];

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
  refunded: {
    label: "Hoàn tiền",
    color: "bg-blue-100 text-blue-700",
    icon: <FontAwesomeIcon icon={faRotate} />,
  },
};

export default function TransactionHistory() {
  return (
    <div className="min-h-screen max-w-5xl mx-auto bg-white rounded-2xl p-8 ml-4 shadow-md">
      <h2 className="text-2xl font-bold mb-6">Lịch sử giao dịch</h2>

      <div className="space-y-4 cursor-pointer h-full">
        {transactions.map((tx) => {
          const status = statusConfig[tx.status];
          return (
            <div
              key={tx.id}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={tx.productImg}
                  alt={tx.productName}
                  width={64}
                  height={64}
                  className="rounded-lg object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {tx.productName}
                  </p>
                  <p className="text-sm text-gray-500">Mã đơn: {tx.id}</p>
                  <p className="text-sm text-gray-500">Ngày: {tx.date}</p>
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <p className="font-semibold text-lg text-gray-800">
                  {tx.total.toLocaleString("vi-VN")} VND
                </p>
                <div
                  className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full mt-1 ${status.color}`}
                >
                  {status.icon}
                  {status.label}
                </div>
                <button className="w-full flex justify-end mt-2 text-sm text-blue-600 hover:underline cursor-pointer">
                  Xem chi tiết
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
