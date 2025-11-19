import { Link, useSearchParams } from "react-router-dom";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();

  const orderId = params.get("orderId");

  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold text-green-600">
        Thanh toán thành công!
      </h1>
      <p className="mt-8">
        Mã đơn hàng: <b>{orderId}</b>
      </p>

      <Link
        to="/"
        className="inline-block bg-green-600 text-white px-4 py-2 rounded mt-12"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
}
