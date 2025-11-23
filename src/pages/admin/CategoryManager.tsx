import { useState, useEffect } from "react";
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../services/categoryService";

export interface Category {
  id?: string;
  category_id: string;
  category_name: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [currentCategory, setCurrentCategory] = useState<Category>({
    category_id: "",
    category_name: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Không tải được danh mục sản phẩm");
    }
  };

  const handleOpen = () => {
    setIsEdit(false);
    setCurrentCategory({ category_id: "", category_name: "" });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setCurrentCategory({
      category_id: "",
      category_name: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };

  const handleSave = async () => {
    if (!currentCategory.category_id || !currentCategory.category_name) {
      return toast.warning("Vui lòng điền đầy đủ thông tin.");
    }

    setIsModalOpen(false);

    try {
      if (isEdit) {
        await updateCategory(currentCategory);
        toast.success("Đã cập nhật sản phẩm thành công.");
      } else {
        await createCategory(currentCategory);
        toast.success("Đã thêm sản phẩm thành công.");
      }

      handleClose();
      await fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi lưu sản phẩm.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      await deleteCategory(id);
      toast.success("Đã xóa sản phẩm thành công.");
      await fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi xóa sản phẩm.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          Danh sách danh mục ({categories.length})
        </h2>
        <button
          onClick={() => handleOpen()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Thêm Danh Mục
        </button>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <div className="max-h-[706px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 sticky top-0 z-10 border-b">
              <tr className="text-gray-700 text-sm uppercase tracking-wide">
                <th className="p-4">TÊN DANH MỤC</th>
                <th className="p-4">ID DANH MỤC</th>
                <th className="p-5 text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr
                  key={category.category_id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-600">
                      {category.category_name}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-600">
                      {category.category_id}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-medium">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setIsEdit(true);
                          setCurrentCategory(category);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-500 cursor-pointer"
                        title="Sửa"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id!)}
                        className="text-red-500 hover:text-red-300 cursor-pointer"
                        title="Xóa"
                      >
                        <FontAwesomeIcon icon={faTrashCan} size="lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    Không có danh mục nào.
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
            <label className="block text-gray-600 mb-1">ID Danh Mục:</label>
            <input
              name="category_id"
              value={currentCategory.category_id}
              onChange={handleChange}
              placeholder="Nhập ID danh mục..."
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Tên Danh Mục:</label>
            <input
              name="category_name"
              value={currentCategory.category_name}
              onChange={handleChange}
              placeholder="Nhập tên danh mục..."
              className="w-full border rounded-md p-2"
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
