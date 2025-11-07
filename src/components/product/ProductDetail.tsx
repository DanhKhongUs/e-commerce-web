import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../context/ProductContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "../../types";
import { getProductById } from "../../services/productService";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const data = await getProductById(id);
        setProduct(data.data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    fetchProduct();
  }, [id]);
  if (!product) {
    return (
      <div className="text-center py-10 text-gray-700 font-semibold max-w-screen-xl mx-auto bg-[#fdfbf5]">
        Đang tải sản phẩm...
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
    navigate("/cart");
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
