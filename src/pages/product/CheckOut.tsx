import { useCart } from "../../context/ProductContext";
import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="shadow-md rounded-md mt-10 max-w-screen-xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Thông tin thanh toán */}
      <div className="border border-gray-500 p-6 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-bold text-pink-700 mb-4">
          THÔNG TIN THANH TOÁN
        </h2>
        <form className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block font-medium mb-1">Họ và tên *</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="Họ tên của bạn"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Số điện thoại *</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="Số điện thoại của bạn"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Địa chỉ email *</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="Email của bạn"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Tỉnh/Thành phố *</label>
            <select className="w-full border p-2 rounded">
              <option>Hà Nội</option>
              <option>TP. HCM</option>
              <option>Khác</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Quận/Huyện *</label>
            <select className="w-full border p-2 rounded">
              <option>Chọn quận huyện</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Xã/Phường *</label>
            <select className="w-full border p-2 rounded">
              <option>Chọn xã/phường</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Địa chỉ *</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="Ví dụ: Số 20, ngõ 90"
              required
            />
          </div>

          <div className="col-span-2">
            <h3 className="font-bold text-pink-700 mb-2">THÔNG TIN BỔ SUNG</h3>
            <label className="block mb-1 ">Ghi chú đơn hàng (tùy chọn)</label>
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Ghi chú về đơn hàng..."
            ></textarea>
          </div>
        </form>
      </div>

      {/* Đơn hàng */}
      <div className="border border-gray-500 p-6 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-bold text-pink-700 mb-6">
          ĐƠN HÀNG CỦA BẠN
        </h2>

        <div className="flex justify-between font-semibold border-b pb-2 uppercase text-gray-700">
          <span>Sản phẩm</span>
          <span>Tạm tính</span>
        </div>

        {cart.map((item) => (
          <div
            key={item.product.id}
            className="flex justify-between py-2  border-b last:border-b-0"
          >
            <span className="text-gray-800">
              {item.product.name} × {item.quantity}
            </span>
            <span className="text-gray-800">
              {(item.product.price * item.quantity).toLocaleString()}₫
            </span>
          </div>
        ))}

        {/* Tổng tiền */}
        <div className="mt-6 space-y-2 ">
          <div className="flex justify-between font-semibold">
            <span>Tạm tính</span>
            <span>{total.toLocaleString()}₫</span>
          </div>
          <div className="flex justify-between font-bold text-base text-gray-900">
            <span>Tổng</span>
            <span>{total.toLocaleString()}₫</span>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="mt-6">
          <label className="block font-semibold mb-3  text-gray-800">
            Phương thức thanh toán
          </label>
          <div className="space-y-3  text-gray-700">
            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="payment"
                defaultChecked
                className="mt-1 accent-pink-600"
              />
              <span>
                <strong>Ship & trả tiền mặt khi nhận hàng</strong>
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="payment"
                className="mt-1 accent-pink-600"
              />
              <span>Chuyển khoản ngân hàng</span>
            </label>
          </div>
        </div>

        {/* Nút đặt hàng */}
        <button
          onClick={() => {
            alert("Đặt hàng thành công!");
            clearCart();
            navigate("/");
          }}
          className="mt-12 w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition duration-200"
        >
          ĐẶT HÀNG
        </button>
      </div>

      <div>
        <Link
          to="/cart"
          className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
        >
          QUAY TRỞ LẠI GIỎ HÀNG
        </Link>
      </div>
    </div>
  );
};

export default Checkout;
