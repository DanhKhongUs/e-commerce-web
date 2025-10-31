import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Listing } from "../../types";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("blogs");
    if (saved) {
      const data = JSON.parse(saved) as Listing[];
      const found = data.find((item) => item.id === id);
      if (found) setListing(found);
    }
  }, [id]);

  if (!listing)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Không tìm thấy bài đăng này.
      </div>
    );

  return (
    <div className="min-h-screen mt-10">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-4 p-6">
          <div>
            <img
              src={listing.images?.[0] || "https://via.placeholder.com/400"}
              alt={listing.name}
              className="w-full h-80 object-cover rounded-lg"
            />
            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {listing.images.slice(1).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`preview-${i}`}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {listing.name}
              </h1>
              <p className="text-gray-600 text-lg mb-1">
                Hãng: <span className="font-medium">{listing.brand}</span>
              </p>
              <p className="text-gray-600 text-lg mb-1">
                Năm sản xuất:{" "}
                <span className="font-medium">{listing.year}</span>
              </p>
              <p className="text-gray-600 text-lg mb-1">
                Tình trạng:{" "}
                <span className="font-medium capitalize">
                  {listing.condition}
                </span>
              </p>
            </div>

            <div className="border-t pt-10 flex items-center gap-4">
              <h2 className="text-pink-600 text-3xl font-semibold">Giá bán:</h2>
              <p className="text-3xl font-bold text-pink-700">
                {listing.price
                  ? `${listing.price.toLocaleString()} VNĐ`
                  : "Chưa có giá gợi ý"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 border-t">
          <h3 className="text-2xl font-semibold mt-6 mb-2">Mô tả chi tiết</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {listing.description || "Không có mô tả chi tiết."}
          </p>
        </div>

        <div className="px-6 pb-6">
          <Link
            to="/blogs"
            className="inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium"
          >
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
}
