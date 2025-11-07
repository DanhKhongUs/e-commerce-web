import httpRequest from "../utils/httpRequest";

export const getAllCategories = async () => {
  const { data } = await httpRequest.get("/categories");
  return data;
};
