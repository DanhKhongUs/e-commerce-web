import httpRequest from "../utils/httpRequest";

export const getAllOrders = async () => {
  const { data } = await httpRequest.get("/orders");
  return data;
};

export const getOrderById = async (id: string) => {
  const { data } = await httpRequest.get(`/orders/${id}`);
  return data;
};
