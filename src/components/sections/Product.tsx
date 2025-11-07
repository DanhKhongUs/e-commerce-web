import { useState, useEffect } from "react";
import ProductCard from "../product/ProductCard";
import Pagination from "../product/Pagination";
import { getAllProducts } from "../../services/productService";
import { IProduct } from "../../types";
import { useSearchParams } from "react-router-dom";

const Product = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParams = searchParams.get("category") || "all_products";
  const [selectCategory, setSelectCategory] = useState(categoryParams);

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectCategory(e.target.value);
    setSearchParams({ category: e.target.value });
  };

  const filteredProducts =
    selectCategory === "all_products"
      ? products
      : products.filter((product) => product.category === selectCategory);

  return (
    <section className="relative min-h-screen w-full overflow-hidden px-8 mt-12 p-6">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex justify-between mb-2 border-b pb-4">
            <div className="flex gap-4 items-center">
              <h2 className="text-base lg:text-2xl text-gray-700 font-bold">
                Có <span className="underline">{products.length}</span> sản phẩm
              </h2>

              <div className="flex border text-sm border-gray-700">
                <select
                  name="Chose"
                  className="p-1"
                  onChange={handleFilterChange}
                  value={selectCategory}
                >
                  <option value="all_products">Tất cả sản phẩm</option>
                  <option value="ban_phim">Bàn Phím</option>
                  <option value="chuot">Chuột</option>
                  <option value="tai_nghe">Tai Nghe</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </section>
  );
};

export default Product;
