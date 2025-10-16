"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import { Products } from "@/data/product";
import { useCart } from "@/context/ProductContext";
import Image from "next/image";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const productId = Number(id);

  const product = Products.find((p) => p.id === productId);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="text-center py-10 text-gray-700 font-semibold max-w-screen-xl mx-auto bg-[#fdfbf5]">
        Sản phẩm không tồn tại.
      </div>
    );
  }

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert("Thêm vào giỏ hàng thành công!");
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row gap-10 max-w-screen-xl mx-auto p-4 mt-4">
      {/* Hình ảnh sản phẩm */}
      <div className="relative max-h-[600px] max-w-[600px]">
        <Image
          src={product.img}
          alt={product.name}
          width={600}
          height={600}
          className="rounded-xl w-full h-[500px] object-cover"
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="space-y-7 mt-10">
        <h1 className="text-2xl font-bold text-gray-700">{product.name}</h1>

        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon
              icon={faStar}
              key={i}
              className={`h-3 w-3 ${
                i < (product.rating ?? 0)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium text-gray-700">
            {(product.rating ?? 0).toFixed(1)}
          </span>
        </div>

        <p className="text-xl text-red-600 font-semibold">
          <span className="text-gray-600">Giá: </span>
          {parseInt(product.price.toString()).toLocaleString("vi-VN")} VND
        </p>

        <p className="text-gray-700">
          <span className="font-medium">Mô tả: </span>
          {product.description}
        </p>

        {/* Chọn số lượng */}
        <div>
          <label className="font-medium">Số lượng:</label>
          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={decreaseQuantity}
              className="border px-3 py-1 rounded bg-white hover:bg-gray-100 cursor-pointer"
            >
              -
            </button>
            <span className="min-w-[24px] text-center">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="border px-3 py-1 rounded bg-white hover:bg-gray-100 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex gap-8">
          <button
            onClick={handleAddToCart}
            className="mt-2 bg-[#f4e3ea] border-[#f4a9c8] border text-pink-700 px-6 py-3 hover:bg-[#f5eef1] rounded shadow cursor-pointer transition"
          >
            <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
            Thêm Vào Giỏ Hàng
          </button>

          <button
            onClick={handleBuyNow}
            className="mt-2 bg-[#c83371] hover:opacity-90 text-white px-6 py-2 rounded shadow cursor-pointer"
          >
            Mua Ngay
          </button>
        </div>
      </div>
    </div>
  );
}
