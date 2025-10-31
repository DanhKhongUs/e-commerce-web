import httpRequest, { setAccessToken } from "../utils/httpRequest";

interface Data {
  email: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
  newPassword?: string;
}

export const signup = async (data: Data) => {
  return (await httpRequest.post("/auth/signup", data)).data;
};

export const signin = async (data: Data) => {
  const res = await httpRequest.post("/auth/signin", data);
  setAccessToken(res.data.data.accessToken);
  return res.data;
};

export const signout = async () => {
  const { data } = await httpRequest.post("/auth/signout", {});
  setAccessToken(null);
  return data;
};

export const checkAuth = async () => {
  return (await httpRequest.get("/auth/profile")).data;
};
