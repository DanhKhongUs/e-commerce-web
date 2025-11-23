import { Category } from "../pages/admin/CategoryManager";
import httpRequest from "../utils/httpRequest";

export const getAllCategories = async () => {
  const { data } = await httpRequest.get("/categories");
  return data;
};

export const createCategory = async (category: Category) => {
  const { data } = await httpRequest.post("/categories", category);
  return data;
};

export const updateCategory = async ({ id, ...update }: Category) => {
  const { data } = await httpRequest.put(`/categories/${id}`, update);
  return data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await httpRequest.delete(`/categories/${id}`);
  return data;
};
