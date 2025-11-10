import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCart, deleteCart, updateCart } from "../../services/cartService";
import { ICart } from "../../types";
import { checkAuth } from "../../services/authService";

const Cart = () => {
  const [cart, setCart] = useState<ICart | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await checkAuth();
        setUserId(res.data._id);
      } catch (error) {
        console.error(error);
        setUserId(null);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await getCart(userId);
        setCart(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  const removeFromCart = async (productId: string) => {
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng");
      return;
    }
    try {
      await deleteCart(userId, productId);
      setCart((prev: any) => ({
        ...prev,
        products: prev.products.filter((p: any) => p.productId !== productId),
        totalPrice: prev.products
          .filter((p: any) => p.productId !== productId)
          .reduce((sum: number, p: any) => sum + p.price * p.quantity, 0),
      }));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const increaseQuantity = async (productId: string, quantity: number) => {
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng");
      return;
    }
    try {
      await updateCart(userId, productId, quantity + 1);
      setCart((prev) => {
        if (!prev) return prev;
        const updateProducts = prev.products.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const updateTotalPrice = updateProducts.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0
        );
        return {
          ...prev,
          products: updateProducts,
          totalPrice: updateTotalPrice,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  const decreaseQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 1) return;
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng");
      return;
    }
    try {
      await updateCart(userId, productId, quantity - 1);
      setCart((prev) => {
        if (!prev) return prev;
        const updateProducts = prev.products.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        const updateTotalPrice = updateProducts.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0
        );
        return {
          ...prev,
          products: updateProducts,
          totalPrice: updateTotalPrice,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
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

  if (!cart || cart.products.length === 0) {
    return (
      <div className="text-center py-10 px-4 sm:px-6 lg:px-8 text-[#4a4a4a] max-w-screen-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8">
          Chưa có sản phẩm nào trong giỏ hàng.
        </h2>
        <Link
          to="/"
          className="bg-[#4a4a4a] text-white px-6 py-2 rounded hover:bg-[#434343]"
        >
          QUAY TRỞ LẠI CỬA HÀNG
        </Link>
      </div>
    );
  }

  const total = cart.totalPrice || 0;

  return (
    <div className="bg-white shadow-md rounded-md mt-10 px-4 sm:px-6 lg:px-8 py-10 text-[#4a4a4a] max-w-screen-xl mx-auto">
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 bg-white border border-gray-500 p-6 rounded">
          <h2 className="font-bold text-lg mb-4">
            SẢN PHẨM
            <hr className="w-8 border border-[#c0b49f]" />
          </h2>

          <div>
            <div className="hidden sm:grid grid-cols-6 font-bold text-sm uppercase text-[#4a4a4a] border-b py-2">
              <div className="col-span-2">Sản phẩm</div>
              <div className="col-span-1 text-center">Giá</div>
              <div className="col-span-1 text-center">Số lượng</div>
              <div className="col-span-1 text-right pr-2">Tạm tính</div>
            </div>

            {cart.products.map((item: any) => (
              <div
                key={item.productId}
                className="grid grid-cols-1 sm:grid-cols-6 items-start sm:items-center py-4 border-b text-[#4a4a4a] gap-4"
              >
                <div className="sm:col-span-2 flex items-start gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-16 object-cover"
                  />
                  <div className="flex-1">
                    <span className="font-semibold uppercase text-sm">
                      {item.name}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:block text-center font-medium">
                  {item.price.toLocaleString()}₫
                </div>

                <div className="hidden sm:flex justify-center">
                  <label className="font-medium">Số lượng:</label>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.productId, item.quantity)
                      }
                      className="border px-3 py-1 rounded bg-white hover:bg-gray-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        increaseQuantity(item.productId, item.quantity)
                      }
                      className="border px-3 py-1 rounded bg-white hover:bg-gray-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="hidden sm:block text-right font-medium">
                  {(item.price * item.quantity).toLocaleString()}₫
                </div>

                <div className="hidden sm:flex justify-center">
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-gray-500 hover:text-gray-600 text-xl"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/products"
              className="inline-block bg-pink-100 border-pink-600 border text-pink-600 font-semibold px-4 py-2 rounded hover:bg-pink-50 transition"
            >
              ← TIẾP TỤC XEM SẢN PHẨM
            </Link>
          </div>
        </div>

        {/* Tổng giỏ hàng */}
        <div className="bg-white border border-gray-500 p-6 rounded">
          <h3 className="font-bold text-lg mb-4">CỘNG GIỎ HÀNG</h3>
          <div className="space-y-2">
            <div className="flex justify-between font-semibold border-b pb-2">
              <span>Tạm tính</span>
              <span>{total.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Tổng</span>
              <span>{total.toLocaleString()}₫</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block text-center bg-[#c30069] text-white py-3 rounded font-semibold hover:bg-[#a10056] transition"
          >
            TIẾN HÀNH THANH TOÁN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
