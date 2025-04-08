import api from "./axios";

export const LoginRequest = async (credentials) => {
  const response = await api.post("login", credentials);

  return response.data;
};

export const LoggedUserRequest = async () => {
  const response = await api.get("user");

  return response.data;
};

export const LogoutRequest = async () => {
  const response = await api.post("logout");

  return response.data;
};
