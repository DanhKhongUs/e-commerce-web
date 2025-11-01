import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import {
  faArrowTrendUp,
  faDollarSign,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DashboardTable() {
  const revenueData = useMemo(
    () => [
      { month: "Jan", revenue: 25000000, transactions: 120 },
      { month: "Feb", revenue: 30000000, transactions: 150 },
      { month: "Mar", revenue: 45000000, transactions: 200 },
      { month: "Apr", revenue: 42000000, transactions: 180 },
      { month: "May", revenue: 48000000, transactions: 210 },
      { month: "Jun", revenue: 52000000, transactions: 240 },
      { month: "Jul", revenue: 60000000, transactions: 260 },
      { month: "Aug", revenue: 64000000, transactions: 300 },
      { month: "Sep", revenue: 70000000, transactions: 310 },
      { month: "Oct", revenue: 72000000, transactions: 340 },
    ],
    []
  );

  const totalTransactions = revenueData.reduce(
    (sum, d) => sum + d.transactions,
    0
  );
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);

  const last = revenueData[revenueData.length - 1];
  const prev = revenueData[revenueData.length - 2];
  const growthRate = ((last.revenue - prev.revenue) / prev.revenue) * 100;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <FontAwesomeIcon icon={faExchangeAlt} className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tổng số giao dịch</p>
            <h3 className="text-2xl font-semibold">
              {totalTransactions.toLocaleString("vi-VN")}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <FontAwesomeIcon icon={faDollarSign} className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tổng doanh thu</p>
            <h3 className="text-2xl font-semibold">
              {totalRevenue.toLocaleString("vi-VN")} VND
            </h3>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
            <FontAwesomeIcon icon={faArrowTrendUp} className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tăng trưởng tháng này</p>
            <h3
              className={`text-2xl font-semibold ${
                growthRate >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {growthRate.toFixed(1)}%
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Doanh thu</h2>

        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis width="auto" />
            <Tooltip
              formatter={(value: number) =>
                value.toLocaleString("vi-VN") + "VND"
              }
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
