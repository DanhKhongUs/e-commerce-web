import { useState, useEffect, ChangeEvent } from "react";
import { Modal } from "antd";
import { ICategory, IProduct } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
  getAllProducts,
} from "../../services/productService";
import { toast } from "react-toastify";
import { getAllCategories } from "../../services/categoryService";

export default function ProductManager() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [newProduct, setNewProduct] = useState<IProduct>({
    id: "",
    name: "",
    imageUrl: "",
    category: "",
    price: 0,
    description: "",
    product_date: new Date(),
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (page: number = currentPage) => {
    try {
      const res = await getAllProducts();
      setProducts(
        res.data.map((p: IProduct) => ({
          ...p,
          product_date: new Date(p.product_date),
        }))
      );
      setCurrentPage(page);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải danh sách sản phẩm");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Không tải được danh mục sản phẩm");
    }
  };

  const handleOpen = async (editProduct?: IProduct) => {
    if (editProduct) {
      setIsEdit(true);
      try {
        const res = await getProductById(editProduct.id);
        const productData = res.data;
        setNewProduct({
          ...productData,
          category:
            productData.category?.category_id || productData.category || "",
          product_date: new Date(productData.product_date),
          imageUrl: productData.imageUrl || "",
        });
        setPreviewImage(productData.imageUrl || null);
      } catch (error) {
        console.error(error);
        toast.error("Không tải được dữ liệu sản phẩm.");
      }
    } else {
      setIsEdit(false);
      setNewProduct({
        id: "",
        name: "",
        price: 0,
        description: "",
        category: "",
        imageUrl: "",
        product_date: new Date(),
      });
      setPreviewImage(null);
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setNewProduct({
      id: "",
      name: "",
      price: 0,
      description: "",
      category: "",
      imageUrl: "",
      product_date: new Date(),
    });
    setPreviewImage(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewImage(base64String);
      setNewProduct({ ...newProduct, imageUrl: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      if (!newProduct.category) {
        toast.error("Vui lòng chọn danh mục sản phẩm!");
        return;
      }

      if (isEdit) {
        await updateProduct(newProduct);
        toast.success("Đã cập nhật sản phẩm thành công.");
      } else {
        await createProduct(newProduct);
        toast.success("Đã thêm sản phẩm thành công.");
      }

      handleClose();
      await fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi lưu sản phẩm.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      await deleteProduct(id);
      toast.success("Đã xóa sản phẩm thành công.");
      await fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi xóa sản phẩm.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          Danh sách sản phẩm ({products.length})
        </h2>
        <button
          onClick={() => handleOpen()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Thêm Sản Phẩm
        </button>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <div className="max-h-[706px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 sticky top-0 z-10 border-b">
              <tr className="text-gray-700 text-sm uppercase tracking-wide">
                <th className="p-4">ẢNH</th>
                <th className="p-4">TÊN</th>
                <th className="p-4">GIÁ</th>
                <th className="p-4">DANH MỤC</th>
                <th className="p-4 text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((p) => {
                const categoryName =
                  categories?.find((c) => c.category_id === p.category)
                    ?.category_name || "Không có danh mục";
                return (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <img
                        src={p.imageUrl || "/default-product.jpg"}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    </td>
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4">{p.price.toLocaleString()} VND</td>
                    <td className="p-4">{categoryName}</td>

                    <td className="p-4 mt-6 flex justify-center items-center gap-4">
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleOpen(p)}
                        size="lg"
                      />
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(p.id)}
                        size="lg"
                      />
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    Không có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title={isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
        width={800}
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-600 mb-1">Tên sản phẩm:</label>
            <input
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm..."
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Danh mục:</label>
            <select
              name="category"
              value={newProduct.category}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories?.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Chọn ảnh:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-gray-700"
            />
            {previewImage && (
              <div className="mt-3">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 mb-1">Giá (VNĐ):</label>
              <input
                name="price"
                type="number"
                value={newProduct.price}
                onChange={handleChange}
                placeholder="Nhập giá..."
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Mô tả:</label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sản phẩm..."
              className="w-full border rounded-md p-2 h-24"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEdit ? "Cập nhật" : "Lưu"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
