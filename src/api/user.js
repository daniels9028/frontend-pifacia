import api from "../api/axios";

export const allUsers = async () => {
  const response = await api.get("account");

  return response.data;
};

export const createUser = async (credentials) => {
  const response = await api.post("account", credentials);

  return response.data;
};

export const updateUser = async (credentials) => {
  const response = await api.put(`account/${credentials.id}`, credentials);

  return response.data;
};

export const deleteUser = async (credentials) => {
  const response = await api.delete(`account/${credentials.id}`);

  return response.data;
};
