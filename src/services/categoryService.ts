import httpRequest from "../utils/httpRequest";

export const getAllCategories = async () => {
  const { data } = await httpRequest.get("/admin/categories");
  return data;
};
