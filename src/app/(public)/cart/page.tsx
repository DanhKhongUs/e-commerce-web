"use client";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useCart } from "../../context/ProductContext";
import Image from "next/image";

const Cart = () => {
  const { cart, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center  py-10 px-4 sm:px-6 lg:px-8 text-[#4a4a4a] max-w-screen-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8">
          Chưa có sản phẩm nào trong giỏ hàng.
        </h2>
        <Link
          href="/"
          className="bg-[#4a4a4a] text-white px-6 py-2 rounded hover:bg-[#434343]"
        >
          QUAY TRỞ LẠI CỬA HÀNG
        </Link>
      </div>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="bg-white min-h-screen shadow-md rounded-md mt-10 px-4 sm:px-6 lg:px-8 py-10 text-[#4a4a4a] max-w-screen-xl mx-auto">
      <div className="grid md:grid-cols-3 gap-10">
        {/* Sản phẩm */}
        <div className="md:col-span-2 bg-white border border-gray-500 p-6 rounded">
          <h2 className="font-bold text-lg mb-4">
            SẢN PHẨM
            <hr className="w-8 border border-[#c0b49f]" />
          </h2>
          <div>
            <div className="hidden sm:grid grid-cols-6 font-bold text-sm uppercase text-[#4a4a4a] border-b py-2">
              <div className="col-span-1 text-center"></div>
              <div className="col-span-2">Sản phẩm</div>
              <div className="col-span-1 text-center">Giá</div>
              <div className="col-span-1 text-center">Số lượng</div>
              <div className="col-span-1 text-right pr-2">Tạm tính</div>
            </div>

            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="grid grid-cols-1 sm:grid-cols-6 items-start sm:items-center py-4 border-b text-[#4a4a4a] gap-4"
              >
                <div className="sm:col-span-2 flex items-start gap-4">
                  <Image
                    src={product.img}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="object-cover rounded-lg w-40 h-40"
                  />
                  <div className="flex-1">
                    <span className="font-semibold uppercase text-sm">
                      {product.name}
                    </span>

                    <div className="sm:hidden mt-2 text-sm space-y-1">
                      <p>Giá: {product.price.toLocaleString()} VND</p>
                      <p>Số lượng: {quantity}</p>
                      <p className="font-semibold">
                        Tạm tính: {(product.price * quantity).toLocaleString()}{" "}
                        VND
                      </p>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="mt-2 text-gray-600 text-sm flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex justify-center">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-gray-500 hover:text-gray-600 text-xl"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                <div className="hidden sm:block text-center font-medium">
                  {product.price.toLocaleString()} VND
                </div>

                <div className="hidden sm:flex justify-center">
                  <div className="flex border border-gray-300 rounded text-base">
                    <span className="px-3">{quantity}</span>
                  </div>
                </div>
                <div className="hidden sm:block text-right font-medium">
                  {(product.price * quantity).toLocaleString()} VND
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-block bg-pink-100 border-pink-600 border text-pink-600 font-semibold px-4 py-2 rounded hover:bg-pink-50 transition"
            >
              ← TIẾP TỤC XEM SẢN PHẨM
            </Link>
          </div>
        </div>

        {/* Cộng giỏ hàng */}
        <div className="bg-white border border-gray-500 p-6 rounded">
          <h3 className="font-bold text-lg mb-4">CỘNG GIỎ HÀNG</h3>
          <div className="space-y-2">
            <div className="flex justify-between font-semibold border-b pb-2">
              <span>Tạm tính</span>
              <span>{total.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Tổng</span>
              <span>{total.toLocaleString()} VND</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block text-center bg-[#c30069] text-white hover:bg-[#a10056] py-3 rounded font-semibold  transition"
          >
            TIẾN HÀNH THANH TOÁN
          </Link>

          <div className="mt-6">
            <p className="flex items-center text-[#c30069] font-semibold mb-2">
              <span className="mr-2">🏷️</span> Phiếu ưu đãi
            </p>
            <input
              type="text"
              placeholder="Mã ưu đãi"
              className="w-full border border-gray-300 px-3 py-2 rounded mb-2"
            />
            <button className="w-full bg-[#c30069] text-white py-2 rounded hover:bg-[#a10056] transition">
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
