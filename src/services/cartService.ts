import httpRequest from "../utils/httpRequest";

export const getCart = async (userId: string) => {
  const { data } = await httpRequest.get(`/cart?userId=${userId}`);
  return data;
};

export const addToCart = async (cartProduct: {
  userId: string;
  productId: string;
  quantity: number;
}) => {
  const { data } = await httpRequest.post("/cart", cartProduct);
  return data;
};

export const updateCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const { data } = await httpRequest.put("/cart", {
    userId,
    productId,
    quantity,
  });
  return data;
};

export const deleteCart = async (userId: string, productId: string) => {
  const { data } = await httpRequest.delete("/cart", {
    data: { userId, productId },
  });
  return data;
};
