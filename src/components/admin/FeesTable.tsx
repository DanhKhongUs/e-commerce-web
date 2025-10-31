import { useMemo, useRef, useState } from "react";
import {
  faPenToSquare,
  faSave,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Fee {
  id: number;
  name: string;
  baseAmount: number; // Số tiền gốc
  percentage: number; // Phần trăm hoa hồng
  applied: boolean; // Trạng thái đã áp dụng hay chưa
}

const getStatusColor = (applied: boolean) =>
  applied ? "text-green-700 bg-green-100" : "text-gray-700 bg-gray-100";

export default function FeesTable() {
  const [fees, setFees] = useState<Fee[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: i % 2 === 0 ? "Phí giao dịch" : "Hoa hồng đại lý",
      baseAmount: 1_000_000 + i * 500_00,
      percentage: 5 + i,
      applied: i % 2 === 0,
    }))
  );

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newPercent, setNewPercent] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredFees = useMemo(() => {
    return fees.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [fees, search]);

  const handleSave = (id: number) => {
    if (newPercent !== null) {
      setFees((prev) =>
        prev.map((f) => (f.id === id ? { ...f, percentage: newPercent } : f))
      );
    }
    setEditingId(null);
    setNewPercent(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex rounded-full w-96 border bg-white shadow-md">
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              if (!value.startsWith(" ")) setSearch(value);
            }}
            className="flex-1 px-6 py-2 text-sm sm:text-base bg-transparent text-[#333] placeholder-gray-500 focus:outline-none"
            placeholder="Search..."
          />
          <button className="w-12 sm:w-14 text-lg sm:text-xl border-l-1 rounded-r-full bg-gray-100 hover:bg-gray-50 text-gray-900 hover:text-gray-700 flex items-center justify-center transition cursor-pointer">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-left uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                ID
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                Tên loại phí
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                Phần trăm (%)
              </th>
              <th className="px-6 py-3 text-base font-semibold text-gray-600">
                Số tiền tính ra (VND)
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
            {filteredFees.map((fee) => {
              const calculated = Math.round(
                (fee.baseAmount * fee.percentage) / 100
              );

              return (
                <tr
                  key={fee.id}
                  className="border-t hover:bg-gray-50 transition-colors font-medium"
                >
                  <td className="px-6 py-5">{fee.id}</td>
                  <td className="px-6 py-5">{fee.name}</td>
                  <td className="px-6 py-5">
                    {editingId === fee.id ? (
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-20 text-center"
                        value={newPercent ?? fee.percentage}
                        onChange={(e) => setNewPercent(Number(e.target.value))}
                      />
                    ) : (
                      `${fee.percentage}%`
                    )}
                  </td>
                  <td className="px-6 py-5">
                    {calculated.toLocaleString("vi-VN")}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-default ${getStatusColor(
                        fee.applied
                      )}`}
                    >
                      {fee.applied ? "Đã áp dụng" : "Chưa áp dụng"}
                    </span>
                  </td>
                  <td className="px-6 py-5 flex gap-2 items-center">
                    {editingId === fee.id ? (
                      <button
                        onClick={() => handleSave(fee.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FontAwesomeIcon icon={faSave} /> Lưu
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(fee.id);
                          setNewPercent(fee.percentage);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} /> Sửa
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-gray-600">
        <div>Tổng cộng: {filteredFees.length} loại phí</div>
      </div>
    </div>
  );
}
