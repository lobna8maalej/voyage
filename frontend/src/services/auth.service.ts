import api from "../pages/admin/axios";

export const registerUser = (data: {
  email: string;
  password: string;
  username: string;
}) => {
  return api.post("/auth/register", data);
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};