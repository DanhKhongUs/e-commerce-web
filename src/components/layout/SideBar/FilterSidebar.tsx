export default function FilterSidebar() {
  return (
    <aside className="w-72 bg-white rounded-xl border shadow p-4 space-y-6">
      <h1 className="text-2xl font-bold">BỘ LỌC</h1>
      <div>
        <h4 className="font-semibold text-lg mb-2">Thể loại</h4>
        {["Tất cả sản phẩm", "Xe", "Pin"].map((cat) => (
          <label
            key={cat}
            className="flex items-center gap-2 mb-1 cursor-pointer"
          >
            <input type="checkbox" className="accent-orange-500" />
            <span>{cat}</span>
          </label>
        ))}
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Giá </h4>
        <input
          type="range"
          min={10}
          max={5000}
          defaultValue={500}
          className="w-full accent-orange-500"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {["$10-$100", "$100-$1000", "$1000-$3000", "$3000-$5000"].map((p) => (
            <button
              key={p}
              className="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-orange-500 hover:text-white transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
