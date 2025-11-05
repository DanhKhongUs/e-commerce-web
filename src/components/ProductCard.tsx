import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
  product: IProduct;
}

const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg hover:-translate-y-1 transition relative cursor-pointer"
    >
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-60 object-cover"
        />

        {product.discount && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-2 rounded-md">
            {product.discount}% GIẢM
          </div>
        )}
      </div>

      <div className="p-3 space-y-4">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10">
          {product.name}
        </h3>

        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Giá:</span>
            <span className="text-red-600 font-semibold text-lg">
              {product.price.toLocaleString("vi-VN")}₫
            </span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon
                icon={faStar}
                key={i}
                className={`h-3 w-3 ${
                  i < Math.round(product.rating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-medium text-gray-700">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
