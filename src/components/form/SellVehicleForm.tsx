import { useState } from "react";

interface Spec {
  name: string;
  value: string;
}

export default function SellVehicleForm() {
  const [formData, setFormData] = useState({
    productType: "xe",
    name: "",
    brand: "",
    year: "",
    condition: "mới",
    description: "",
    images: [] as string[],
  });

  const [specs, setSpecs] = useState<Spec[]>([
    { name: "Dung lượng pin", value: "" },
    { name: "Công suất motor", value: "" },
    { name: "Quãng đường tối đa", value: "" },
    { name: "Thời gian sạc", value: "" },
    { name: "Trọng lượng xe", value: "" },
  ]);

  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const getSuggestedPrice = async () => {
    setLoadingAI(true);
    await new Promise((r) => setTimeout(r, 1500));

    const base = Math.random() * 20000000 + 10000000;
    const low = base - 2000000;
    const high = base + 2000000;
    setSuggestedPrice(Math.round(base));
    setPriceRange([Math.round(low), Math.round(high)]);
    setLoadingAI(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (index: number, value: string) => {
    const updated = [...specs];
    updated[index].value = value;
    setSpecs(updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newImages = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 5),
    }));
  };

  const handleSubmit = () => {
    const newListing = {
      id: Date.now().toString(),
      ...formData,
      price: suggestedPrice || 0,
    };

    const existing = JSON.parse(localStorage.getItem("blogs") || "[]");
    localStorage.setItem("blogs", JSON.stringify([...existing, newListing]));

    alert("Đăng tin thành công!");
    window.location.href = "/blogs";
  };

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-pink-600">
        Đăng tin bán xe / pin
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Loại sản phẩm
          </label>
          <select
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="xe">Xe điện</option>
            <option value="pin">Pin xe</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="VD: VinFast Evo200"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Hãng sản xuất
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="VD: VinFast"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Năm sản xuất</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="2025"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tình trạng</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="mới">Mới</option>
            <option value="cũ">Đã qua sử dụng</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-1">Mô tả chi tiết</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Mô tả thêm về xe/pin..."
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Hình ảnh sản phẩm (tối đa 5 ảnh)
        </label>
        <input type="file" multiple onChange={handleImageUpload} />
        <div className="flex gap-3 mt-3 flex-wrap">
          {formData.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`preview-${i}`}
              className="w-28 h-28 object-cover rounded-lg border"
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">⚙️ Thông số kỹ thuật</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {specs.map((spec, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1">
                {spec.name}
              </label>
              <input
                type="text"
                value={spec.value}
                onChange={(e) => handleSpecChange(index, e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 p-6 border rounded-xl bg-pink-50">
        <h3 className="text-lg font-semibold mb-3">AI gợi ý giá bán</h3>
        {loadingAI ? (
          <p className="text-gray-500">Đang phân tích dữ liệu thị trường...</p>
        ) : suggestedPrice ? (
          <div className="space-y-2">
            <p className="text-xl font-bold text-pink-700">
              Giá gợi ý: {suggestedPrice.toLocaleString()} VNĐ
            </p>
            {priceRange && (
              <p className="text-sm text-gray-600">
                Mức dao động hợp lý: {priceRange[0].toLocaleString()} -{" "}
                {priceRange[1].toLocaleString()} VNĐ
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-600 italic">
            Chưa có dữ liệu — nhấn nút bên dưới để lấy gợi ý.
          </p>
        )}

        <button
          onClick={getSuggestedPrice}
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          {loadingAI ? "Đang xử lý..." : "Lấy gợi ý giá"}
        </button>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          Hủy bỏ
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Đăng tin
        </button>
      </div>
    </div>
  );
}
