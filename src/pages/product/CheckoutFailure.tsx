import { Link, useSearchParams } from "react-router-dom";

const CheckoutFailure = () => {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold text-red-600">Thanh toán thất bại!</h1>
      <p className="mt-3">
        Mã đơn hàng: <b>{orderId}</b>
      </p>

      <Link
        to="/checkout"
        className="inline-block bg-red-600 text-white px-4 py-2 rounded mt-6"
      >
        Thử lại
      </Link>
    </div>
  );
};

export default CheckoutFailure;
