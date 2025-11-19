import httpRequest from "../utils/httpRequest";

export const createCheckout = async (payload: { typePayment: string }) => {
  return await httpRequest.post("/checkout/create", payload);
};
