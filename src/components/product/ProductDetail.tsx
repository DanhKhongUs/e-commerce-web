import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "../../types";
import { getProductById } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { addCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-600">
        <svg
          className="animate-spin h-8 w-8 mr-3 text-pink-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span>Đang tải giỏ hàng...</span>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      await addCart(product.id, quantity);
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  const handleBuyNow = async () => {
    try {
      await addCart(product.id, quantity);
      navigate("/cart");
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi mua sản phẩm");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <div className="relative max-h-[700px] max-w-[700px]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="rounded-xl w-full h-full object-cover"
        />
      </div>

      <div className="md:space-y-10 space-y-6 md:mt-20 mt-2">
        <h1 className="text-2xl font-bold text-gray-700">{product.name}</h1>

        <p className="text-xl text-red-600 font-semibold">
          <span className="text-gray-600">Giá: </span>
          {product.price.toLocaleString("vi-VN")} VND
        </p>
        <p className=" text-gray-700">
          <span className="font-medium">Mô tả: </span>
          {product.description}
        </p>

        <div>
          <label className="font-medium">Số lượng:</label>
          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="border px-3 py-1 rounded bg-white hover:bg-gray-100 cursor-pointer"
            >
              -
            </button>
            <span className="min-w-[24px] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="border px-3 py-1 rounded bg-white hover:bg-gray-100 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex gap-8">
          <button
            onClick={handleAddToCart}
            className="mt-2 bg-[#ff57221a] border-[#ee4d2d] border text-[#ee4d2d] px-6 py-3 hover:bg-[#ffad941a] rounded shadow cursor-pointer transition"
          >
            <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
            Thêm Vào Giỏ Hàng
          </button>
          <button
            onClick={handleBuyNow}
            className="mt-2 bg-[#ee4d2d] hover:opacity-90 text-white px-6 py-2 rounded shadow cursor-pointer"
          >
            Mua Ngay
          </button>
        </div>
      </div>
    </div>
  );
}
